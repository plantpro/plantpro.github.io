"use strict";

var table = $("#table");
var button = $("#export-btn");
$(".table-add").click(function () {
  var clone = table.find("tr.hide").clone(true).removeClass("hide table-line");
  table.find("table").append(clone);
});
$(".table-remove").click(function () {
  $(this).parents("tr").detach();
});
$(".table-up").click(function () {
  var row = $(this).parents("tr");
  if (row.index() === 1) return;
  row.prev().before(row.get(0));
});
$(".table-down").click(function () {
  var row = $(this).parents("tr");
  row.next().after(row.get(0));
});
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;
button.click(function () {
  var rows = table.find("tr:not(:hidden)");
  var headers = [];
  var data = [["", ""]];
  $(rows.shift()).find("th:not(:empty)").each(function () {
    headers.push($(this).text().toLowerCase());
  });
  rows.each(function () {
    var td = $(this).find("td");
    var h = [];
    headers.forEach(function (header, i) {
      if (i == 0) {
        h.push(td.eq(i).text());
      } else {
        h.push(parseInt(td.eq(i).text()));
      }
    });
    data.push(h);
  });
  google.charts.load("current", {
    packages: ["corechart"]
  });
  google.charts.setOnLoadCallback(function () {
    return drawPlot(data);
  });
});