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
  var selectedFields = Array.prototype.filter.call(document.getElementsByName("chk-select"), function (chk) {
    return chk.checked;
  }).map(function (chk) {
    return chk.attributes["data-field"].value;
  });
  var insertVariable = document.getElementById("insertVariable").value;
  var operationType = document.getElementsByName("operationType")[0].value;
  var tableName = document.getElementById("table").value;
  var modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
  var code = "";

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
  var objectVariable = document.getElementById("objectVariable").value;
  return document.getElementsByName("mappedvalue-" + field)[0].value ? "".concat(objectVariable, "->").concat(document.getElementsByName("mappedvalue-" + field)[0].value) : "''";
}

function updateCode(selectedFields, insertVariable, modelName) {
  var isInsert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var insertCode = isInsert ? insertVariable + " = new " + modelName + "();\n" : "".concat(insertVariable, " = ").concat(modelName, "::findOrFail($id);\n");
  insertCode += selectedFields.map(function (field) {
    return "".concat(insertVariable, "->").concat(field, " = ").concat(getMappedValue(field));
  }).join(";\n");
  insertCode += "\n".concat(insertVariable, "->save();");
  return insertCode;
}

function createCode(selectedFields, insertVariable, modelName) {
  var insertCode = "".concat(insertVariable, " = ").concat(modelName, "::create([\n");
  selectedFields.forEach(function (field) {
    insertCode += "\t'".concat(field, "' => ").concat(getMappedValue(field), ";\n");
  });
  insertCode += "]);";
  return insertCode;
}

function massUpdateCode(selectedFields, modelName) {
  // Create conditions and update block
  var conditions = "";
  var updates = "";
  selectedFields.forEach(function (field) {
    if (document.getElementsByName("filter-" + field)[0].value) {
      // Add -> to where methods after the first one
      if (conditions) {
        conditions += "\t->";
      }

      conditions += "where('".concat(field, "', '") + document.getElementsByName("filter-" + field)[0].value + "', ".concat(getMappedValue(field), "->)\n");
    } else {
      updates += "\t\t\t'".concat(field, "' => ").concat(getMappedValue(field), ",\n");
    }
  });

  if (!conditions) {
    conditions = "where('', '')\n";
  }

  return "".concat(modelName, "::").concat(conditions, "\t->update(\n\t\t[\n").concat(updates, "\t\t]\n\t);");
}

function updateOrInsert(selectedFields, tableName) {
  // Create conditions and update block
  var conditions = [];
  var updates = "";
  selectedFields.forEach(function (field) {
    if (document.getElementsByName("filter-" + field)[0].value) {
      conditions.push("\t\t\t'".concat(field, "' => ").concat(getMappedValue(field)));
    } else {
      updates += "\t\t\t'".concat(field, "' => ").concat(getMappedValue(field), ",\n");
    }
  });
  return "DB::table('".concat(tableName, "')\n\t->updateOrCreate(\n\t\t[\n").concat(conditions, "\n\t\t],\n\t\t[\n").concat(updates, "\t\t]\n\t);");
}
/******/ })()
;