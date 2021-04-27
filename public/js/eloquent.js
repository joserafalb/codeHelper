/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./resources/js/eloquent.js ***!
  \**********************************/
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#fields-table select,input[type=checkbox],#refreshCode").forEach(function (el) {
    return el.onclick = buildCode;
  });
  document.querySelector("select.update").addEventListener("change", buildCode);
});

function buildCode() {
  var insertVariable = document.getElementById("insertVariable").value;
  var operationType = document.getElementsByName("operationType")[0].value;
  var code = "";

  switch (operationType) {
    case "Insert":
      code = updateCode(insertVariable, true);
      break;

    case "Create":
      code = "".concat(getModelFunction("create", true), "([\n").concat(getFieldsAssigment().join(",\n"), "\n]);");
      break;

    case "Update":
      code = updateCode(insertVariable);
      break;

    case "Mass Updates":
      code = massUpdateCode();
      break;

    case "Update or Create":
      code = "".concat(getModelFunction("updateOrCreate"), "(\n\t\t[\n\t\t").concat(getFieldsAssigment(true, true).join(",\n\t\t"), "\n\t\t],\n\t\t[\n\t\t").concat(getFieldsAssigment().join(",\n\t\t"), "\n\t\t]\n\t);");
      break;

    case "Delete":
      code = "".concat(getModelFunction("findOrFail($id);", true), "\n").concat(insertVariable, "->delete();");
      break;

    case "Delete by Primary Key":
      code = getModelFunction("destroy($id);");
      break;

    case "Query Insert":
      code = "".concat(getDbFunction("insert"), "([\n\t").concat(getFieldsAssigment().join(",\n\t"), "\n]);");
      break;

    case "Insert or Ignore":
      code = "".concat(getDbFunction("insertOrIgnore"), "([\n\t").concat(getFieldsAssigment().join(",\n\t"), "\n]);");
      break;

    case "Insert Get Id":
      code = "$newId = ".concat(getDbFunction("insertGetId"), "([\n\t").concat(getFieldsAssigment().join(",\n\t"), "\n]);");
      break;

    case "Query Update":
      code = "$affectedRows = ".concat(getDbFunction("where")).concat(getFieldsAssigment(false, true, true).join("\n\t->where"), "\n\t->update(\n\t\t[\n\t\t").concat(getFieldsAssigment().join(",\n\t\t"), "\n\t\t]\n\t);");
      break;

    case "Update or Insert":
      code = "".concat(getDbFunction('updateOrInsert'), "(\n\t[\n\t").concat(getFieldsAssigment(true, true).join(',\n\t'), "\n\t],\n\t[\n\t").concat(getFieldsAssigment(true).join(',\n\t'), "\n\t]\n)");
      break;

    case "Query Delete":
      code = "".concat(getDbFunction('where')).concat(getFieldsAssigment(false, true, true).join('\n\t->where'), "\n\t->delete();");
      break;

    default:
      break;
  }

  if (document.getElementsByName('tinkerMode')[0].checked) {
    code = document.getElementById('insert-code').value.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/(;)/gm, ";\n").trim();
  }

  document.getElementById("insert-code").value = code;
}

function getDbFunction(method) {
  var tableName = document.getElementById("table").value;
  return "DB::table('".concat(tableName, "')->").concat(method);
}
/**
 * Get mapped value from the object variable name or empty string if not defined
 *
 * @param {string} field The field name to get the mapped value
 * @returns {string}
 */


function getMappedValue(field) {
  var objectVariable = document.getElementById("objectVariable").value;
  return document.getElementsByName("mappedvalue-" + field)[0].value ? "".concat(objectVariable, "->").concat(document.getElementsByName("mappedvalue-" + field)[0].value) : "''";
}
/**
 * Build string to declare the model and the first function to use (Ex. Model::function)
 *
 * @param {string} method The method to call for the model
 * @param {boolean} isReturn Should it assign it to a variable? (Default: false)
 * @param {boolean} isNew Specifies if it should return a new instance of the model (Default: false)
 * @returns {string}
 */


function getModelFunction(method) {
  var isReturn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var isNew = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var modelName = document.getElementById("modelName").value;

  if (document.getElementsByName('fullNameClass')[0].checked) {
    modelName = "App\\Models\\".concat(modelName);
  }

  var insertVariable = document.getElementById("insertVariable").value;
  return (isReturn ? "".concat(insertVariable, " = ") : "") + (isNew ? " new ".concat(modelName, "();") : "".concat(modelName, "::").concat(method));
}
/**
 * Get fields assignment
 *
 * @param {boolean} isArrayFormat
 * @returns {Array}
 */


function getFieldsAssigment() {
  var isArrayFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var isFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var isWhereFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var selectedFields = Array.prototype.filter.call(document.getElementsByClassName("field"), function (_ref) {
    var innerText = _ref.innerText;
    return document.getElementsByName("chk-" + innerText)[0].checked && document.getElementsByName("filter-" + innerText)[0].value.length == isFilter;
  }).map(function (field) {
    return field.innerText;
  });

  if (isWhereFilter) {
    if (!selectedFields.length) {
      return ["('', '')"];
    }

    return selectedFields.map(function (field) {
      return "('".concat(field, "', '").concat(document.getElementsByName("filter-" + field)[0].value, "', ").concat(getMappedValue(field), ")");
    });
  }

  return selectedFields.map(function (field) {
    return isArrayFormat ? "\t'".concat(field, "' => ").concat(getMappedValue(field)) : "".concat(document.getElementById("insertVariable").value, "->").concat(field, " = ").concat(getMappedValue(field));
  });
}

function updateCode(insertVariable) {
  var isInsert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return "".concat(getModelFunction("findOrFail($id);", true, isInsert), "\n").concat(getFieldsAssigment(false).join(";\n"), ";\n").concat(insertVariable, "->save();");
}

function massUpdateCode() {
  // Create conditions and update block
  var conditions = getFieldsAssigment(true, true, true);

  if (!conditions.length) {
    conditions.push("('', '')\n");
  }

  return "".concat(getModelFunction("where")).concat(conditions.join("\n\t->where"), "\n\t->update(\n\t\t[\n\t\t").concat(getFieldsAssigment(true).join(",\n\t\t"), "\n\t\t]\n\t);");
}
/******/ })()
;