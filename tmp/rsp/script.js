var Pair = /** @class */ (function () {
    function Pair(name, room) {
        this.name = name;
        this.room = room;
    }
    return Pair;
}());

var days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
var pairWindow = new Pair("", "");
var topPairs = [
    [],
    [],
    [
        new Pair("ГМО [л]", "1346"),
        new Pair("Физра", "спортзальчик"),
        new Pair("Биомет", "1а308"),
        new Pair("Букашки", "1а308"),
    ],
    [
        new Pair("ЗЕМЛИЦА РУССКАЯ", "1а109"),
        new Pair("Земледел [л]", "1524"),
        new Pair("ФиБРа ❤", "1а118"),
        new Pair("Земледел", "1523"),
    ],
    [
        new Pair("Букашки", "1а308"),
        new Pair("Меха [л]", "2713"),
        new Pair("ГМО", "1439"),
        new Pair("Меха", "2820"),
    ],
    [
        new Pair("ЗЕМЛИЦА РУССКАЯ [л]", "1а239"),
        new Pair("Физра", "спортзальчик"),
        new Pair("ЗаРаЗаГр", "1а310")
    ],
    [] // sub
];
var bottomPairs = [
    [],
    [],
    [
        new Pair("ГМО [л]", "1346"),
        new Pair("СоциоЛОГИЧНО [л]", "1439"),
        new Pair("СоциоЛОГИЧНО", "1439")
    ],
    [
		new Pair("ЗЕМЛИЦА РУССКАЯ", "1а109"),
        new Pair("ФиБРа [л] ❤", "1а329"),
        new Pair("ФиБРа ❤", "1а118"),
        new Pair("Земледел", "1523"),
    ],
    [
        new Pair("Букашки", "1а308"),
        new Pair("Биомет", "1а310"),
        new Pair("ГМО", "1439"),
        new Pair("Меха", "2820"),
    ],
    [
        new Pair("ЗЕМЛИЦА РУССКАЯ [л]", "1а239"),
        new Pair("Физра", "спортзальчик"),
        new Pair("ЗаРаЗаГр", "1а310")
    ],
    [] // sub
];
function write(text) {
    document.write(text);
}
function getDayOfWeekName(dayOfWeek) {
    return days[dayOfWeek];
}
function getMonthName(monthNumber) {
    return months[monthNumber];
}
function makeTodayBlock() {
    var nowDate = new Date();
    return "Сегодня " + nowDate.getDate() +
        " " + getMonthName(nowDate.getMonth()) +
        ",  " + getDayOfWeekName(nowDate.getDay()) + "<br>";
}
function normalize(data) {
    return data == 0 ? 7 : data;
}
function getDateWithOffset(offset) {
    var result = new Date();
    result.setDate(result.getDate() + offset);
    return result;
}
function getNextDay() {
    return getDateWithOffset(1);
}
function isTop(offset) {
    var day = getDateWithOffset(offset);
    var dayOfWeek = normalize(day.getDay());
    day.setDate(day.getDate() - dayOfWeek + 1);
    return day.getDate() % 2 != 0;
}
function getCurrentWeek() {
    if (!isTop(0)) {
        return "Эта неделя по верху";
    }
    return "Эта неделя по низу";
}
function getNextWeek() {
    var day = getDateWithOffset(0);
    var dayOfWeek = normalize(day.getDay());
    var date = day.getDate() + (8 - dayOfWeek);
    if (date % 2 == 0) {
        return "Следующая неделя по верху";
    }
    return "Следующая неделя по низу";
}
function getSource() {
    if (!isTop(0)) {
        return topPairs;
    }
    return bottomPairs;
}
function getOnToday() {
    var source = getSource();
    var xsource = source[getDateWithOffset(0).getDay()];
    return buildTable(xsource);
}
function getOnNextDay() {
    var source = getSource();
    var xsource = source[getDateWithOffset(1).getDay()];
    if (xsource.length == 0)
        return "пар нет";
    return buildTable(xsource);
}
function buildTable(source) {
    var result = "<br><table class='pure-table pure-table-horizontal'><tbody>";
    for (var index = 0; index < source.length; index++) {
        var element = source[index];
        result += "<tr><td>" + (index + 1) + "</td><td>" + element.name + "</td><td>" + element.room + "</td></tr>";
    }
    return result + "</tbody></table>";
}
