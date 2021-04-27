document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelectorAll(
            "#fields-table select,input[type=checkbox],#refreshCode"
        )
        .forEach((el) => (el.onclick = buildCode));
    document
        .querySelector("select.update")
        .addEventListener("change", buildCode);
});

function buildCode() {
    const insertVariable = document.getElementById("insertVariable").value;
    const operationType = document.getElementsByName("operationType")[0].value;

    let code = "";
    switch (operationType) {
        case "Insert":
            code = updateCode(insertVariable, true);
            break;
        case "Create":
            code = `${getModelFunction(
                "create",
                true
            )}([\n${getFieldsAssigment().join(",\n")}\n]);`;
            break;
        case "Update":
            code = updateCode(insertVariable);
            break;
        case "Mass Updates":
            code = massUpdateCode();
            break;
        case "Update or Create":
            code = `${getModelFunction(
                "updateOrCreate"
            )}(\n\t\t[\n\t\t${getFieldsAssigment(true, true).join(
                ",\n\t\t"
            )}\n\t\t],\n\t\t[\n\t\t${getFieldsAssigment().join(
                ",\n\t\t"
            )}\n\t\t]\n\t);`;
            break;
        case "Delete":
            code = `${getModelFunction(
                "findOrFail($id);",
                true
            )}\n${insertVariable}->delete();`;
            break;
        case "Delete by Primary Key":
            code = getModelFunction("destroy($id);");
            break;
        case "Query Insert":
            code = `${getDbFunction("insert")}([\n\t${getFieldsAssigment().join(
                ",\n\t"
            )}\n]);`;
            break;
        case "Insert or Ignore":
            code = `${getDbFunction(
                "insertOrIgnore"
            )}([\n\t${getFieldsAssigment().join(",\n\t")}\n]);`;
            break;
        case "Insert Get Id":
            code = `$newId = ${getDbFunction(
                "insertGetId"
            )}([\n\t${getFieldsAssigment().join(",\n\t")}\n]);`;
            break;
        case "Query Update":
            code = `$affectedRows = ${getDbFunction(
                "where"
            )}${getFieldsAssigment(false, true, true).join(
                "\n\t->where"
            )}\n\t->update(\n\t\t[\n\t\t${getFieldsAssigment().join(
                ",\n\t\t"
            )}\n\t\t]\n\t);`;
            break;
        case "Update or Insert":
            code = `${getDbFunction('updateOrInsert')}(\n\t[\n\t${getFieldsAssigment(true, true).join(',\n\t')}\n\t],\n\t[\n\t${getFieldsAssigment(true).join(',\n\t')}\n\t]\n)`
            break;
        case "Query Delete":
            code = `${getDbFunction('where')}${getFieldsAssigment(false, true, true).join('\n\t->where')}\n\t->delete();`
            break;
        default:
            break;
    }

    if (document.getElementsByName('tinkerMode')[0].checked) {
        code = document.getElementById('insert-code').value
        .replace(/(\r\n|\n|\r|\t)/gm, "")
        .replace(/(;)/gm,";\n")
        .trim();
    }

    document.getElementById("insert-code").value = code;
}

function getDbFunction(method) {
    const tableName = document.getElementById("table").value;

    return `DB::table('${tableName}')->${method}`;
}

/**
 * Get mapped value from the object variable name or empty string if not defined
 *
 * @param {string} field The field name to get the mapped value
 * @returns {string}
 */
function getMappedValue(field) {
    const objectVariable = document.getElementById("objectVariable").value;
    return document.getElementsByName("mappedvalue-" + field)[0].value
        ? `${objectVariable}->${
              document.getElementsByName("mappedvalue-" + field)[0].value
          }`
        : `''`;
}

/**
 * Build string to declare the model and the first function to use (Ex. Model::function)
 *
 * @param {string} method The method to call for the model
 * @param {boolean} isReturn Should it assign it to a variable? (Default: false)
 * @param {boolean} isNew Specifies if it should return a new instance of the model (Default: false)
 * @returns {string}
 */
function getModelFunction(method, isReturn = false, isNew = false) {
    let modelName = document.getElementById("modelName").value;

    if (document.getElementsByName('fullNameClass')[0].checked) {
        modelName = `App\\Models\\${modelName}`;
    }

    const insertVariable = document.getElementById("insertVariable").value;
    return (
        (isReturn ? `${insertVariable} = ` : "") +
        (isNew ? ` new ${modelName}();` : `${modelName}::${method}`)
    );
}

/**
 * Get fields assignment
 *
 * @param {boolean} isArrayFormat
 * @returns {Array}
 */
function getFieldsAssigment(
    isArrayFormat = true,
    isFilter = false,
    isWhereFilter = false
) {
    const selectedFields = Array.prototype.filter
        .call(
            document.getElementsByClassName("field"),
            ({ innerText }) =>
                document.getElementsByName("chk-" + innerText)[0].checked &&
                document.getElementsByName("filter-" + innerText)[0].value
                    .length == isFilter
        )
        .map((field) => field.innerText);

    if (isWhereFilter) {
        if (!selectedFields.length) {
            return ["('', '')"];
        }
        return selectedFields.map(
            (field) =>
                `('${field}', '${
                    document.getElementsByName("filter-" + field)[0].value
                }', ${getMappedValue(field)})`
        );
    }

    return selectedFields.map((field) =>
        isArrayFormat
            ? `\t'${field}' => ${getMappedValue(field)}`
            : `${
                  document.getElementById("insertVariable").value
              }->${field} = ${getMappedValue(field)}`
    );
}

function updateCode(insertVariable, isInsert = false) {
    return `${getModelFunction(
        "findOrFail($id);",
        true,
        isInsert
    )}\n${getFieldsAssigment(false).join(";\n")};\n${insertVariable}->save();`;
}

function massUpdateCode() {
    // Create conditions and update block
    let conditions = getFieldsAssigment(true, true, true);
    if (!conditions.length) {
        conditions.push(`('', '')\n`);
    }

    return `${getModelFunction("where")}${conditions.join(
        "\n\t->where"
    )}\n\t->update(\n\t\t[\n\t\t${getFieldsAssigment(true).join(
        ",\n\t\t"
    )}\n\t\t]\n\t);`;
}
