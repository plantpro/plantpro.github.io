var Pair = /** @class */ (function () {
	function Pair(name, room) {
		this.name = name;
		this.room = room;
	}
	return Pair;
}());

var days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
var pairWindow = new Pair("<span style='color:#ff0000;'>ОКНО</span>", "можно бухнуть");
var bottomPairs = [
	[], // vsk
	[], // mon
	[ // tue
		pairWindow,
		new Pair("Агрохимия [л]", "1a239"),
		new Pair("Машины", "корпус 4"),
		new Pair("Агрохимия", "1a219"),
	],
	[ // sat
		pairWindow,
		new Pair("Земледелие", "1523"),
		new Pair("Физра", "спортзал"),
		new Pair("Растения", "1505"),
	],
	[
		new Pair("Земледелие [л]", "1524"),
		new Pair("Фитопатология", "1a303"),
		new Pair("Фитопатология", "1a303"),
		new Pair("ОНИ", "1a312"),
	],
	[
		new Pair("Учительство", "1108"),
		new Pair("ТХиСПР", "1428"),
		new Pair("Физра", "спортзал"),
		new Pair("ТХиСПР", "1428")
	],
	[] // sub
];
var topPairs = [
	[],
	[],
	[
		new Pair("Физра [л]", "1539"),
		new Pair("Агрохимия [л]", "1a239"),
		new Pair("Машины", "корпус 4"),
		new Pair("Агрохимия", "1a21ы9"),
	],
	[
		new Pair("Растения [л]", "1507"),
		new Pair("Земледелие", "1523"),
		new Pair("Машины", "корпус 4"),
		new Pair("Растения", "1505")
	],
	[
		new Pair("Земледелие [л]", "1524"),
		new Pair("Фитопатология", "1a303"),
		new Pair("ОНИ", "1a312"),
		new Pair("ОНИ", "1a312"),
	],
	[
		pairWindow,
		new Pair("Учительство [л]", "1108"),
		new Pair("Физра", "спортзал"),
		new Pair("ТХиСПР", "1428")
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
	if (isTop(0)) {
		return topPairs;
	}
	return bottomPairs;
}

function getOnToday() {
	var source = getSource();
	var xsource = source[getDateWithOffset(0).getDay()];
	if (xsource.length == 0)
		return "<span style='color: #ff0000; font-size: 12px;'>Пар нет</span>";
	return buildTable(xsource);
}
function getOnNextDay() {
	var source = getSource();
	var xsource = source[getDateWithOffset(1).getDay()];
	if (xsource.length == 0)
		return "<span style='color: #ff0000; font-size: 12px;'>Пар нет</span>";
	return buildTable(xsource);
}
function buildTable(source) {
	var result = "<div>";
	for (var index = 0; index < source.length; index++) {
		var element = source[index];
		result += "<span style='color: #3f51b5; font-size: 12px;'>" +
			element.name +
			"</span><br><span class='mdc-list-item__secondary-text' style='padding-left: 10px;'>" + element.room + "</span><br>";
	}
	return result + "</div>";
}

function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

let names = ["Максим", "Шахноза", "Женя", "Вика", "Даша", "Андрей", "Нура", "Настя", "Саша", "Денис", "Денис_2.0"]

let previousRnd;
var rng = new RNG(new Date().getDay() + 1);
function uniquePoop() {
	var rndval = rng.nextRange(0, 11);
	while(rndval == previousRnd) {
		rndval = rng.nextRange(0, 11);
	}
	return rndval;
}

function getPoopOfTheDay() {
	var prev = new RNG(new Date().getDay());
	previousRnd = prev.nextRange(0, 11);
 	return names[uniquePoop()];
}