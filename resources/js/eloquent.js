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
    const selectedFields = Array.prototype.filter
        .call(document.getElementsByName("chk-select"), (chk) => chk.checked)
        .map((chk) => chk.attributes["data-field"].value);
    const insertVariable = document.getElementById("insertVariable").value;
    const operationType = document.getElementsByName("operationType")[0].value;
    const tableName = document.getElementById("table").value;
    const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);

    let code = "";
    switch (operationType) {
        case "Insert":
            code = updateCode(selectedFields, insertVariable, modelName, true);
            break;
        case "Create":
            code = createCode(selectedFields, insertVariable, modelName);
            break;
        case "Update":
            code = updateCode(selectedFields, insertVariable, modelName);
            break;
        case "Mass Updates":
            code = massUpdateCode(selectedFields, modelName);
            break;
        case "Update or Insert":
            code = updateOrInsert(selectedFields, tableName);
            break;
        default:
            break;
    }
    document.getElementById("insert-code").value = code;
}

function getMappedValue(field) {
    const objectVariable = document.getElementById("objectVariable").value;
    return document.getElementsByName("mappedvalue-" + field)[0].value
        ? `${objectVariable}->${
              document.getElementsByName("mappedvalue-" + field)[0].value
          }`
        : `''`;
}

function updateCode(
    selectedFields,
    insertVariable,
    modelName,
    isInsert = false
) {
    let insertCode = isInsert
        ? insertVariable + " = new " + modelName + "();\n"
        : `${insertVariable} = ${modelName}::findOrFail($id);\n`;

    insertCode += selectedFields
        .map(
            (field) => `${insertVariable}->${field} = ${getMappedValue(field)}`
        )
        .join(";\n");

    insertCode += `\n${insertVariable}->save();`;
    return insertCode;
}

function createCode(selectedFields, insertVariable, modelName) {
    let insertCode = `${insertVariable} = ${modelName}::create([\n`;
    selectedFields.forEach((field) => {
        insertCode += `\t'${field}' => ${getMappedValue(field)};\n`;
    });
    insertCode += "]);";
    return insertCode;
}

function massUpdateCode(selectedFields, modelName) {
    // Create conditions and update block
    let conditions = "";
    let updates = "";
    selectedFields.forEach((field) => {
        if (document.getElementsByName("filter-" + field)[0].value) {
            // Add -> to where methods after the first one
            if (conditions) {
                conditions += "\t->";
            }
            conditions +=
                `where('${field}', '` +
                document.getElementsByName("filter-" + field)[0].value +
                `', ${getMappedValue(field)}->)\n`;
        } else {
            updates += `\t\t\t'${field}' => ${getMappedValue(field)},\n`;
        }
    });

    if (!conditions) {
        conditions = `where('', '')\n`;
    }

    return `${modelName}::${conditions}\t->update(\n\t\t[\n${updates}\t\t]\n\t);`;
}

function updateOrInsert(selectedFields, tableName) {
    // Create conditions and update block
    let conditions = [];
    let updates = "";
    selectedFields.forEach((field) => {
        if (document.getElementsByName("filter-" + field)[0].value) {
            conditions.push(`\t\t\t'${field}' => ${getMappedValue(field)}`);
        } else {
            updates += `\t\t\t'${field}' => ${getMappedValue(field)},\n`;
        }
    });

    return `DB::table('${tableName}')\n\t->updateOrCreate(\n\t\t[\n${conditions}\n\t\t],\n\t\t[\n${updates}\t\t]\n\t);`;
}
