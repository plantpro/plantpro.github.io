// Generated by CoffeeScript 2.5.1
(function() {
  //: import flexibel.coffee
  var child, elem, j, k, len, len1, matchContent, ref, ref1, searchTag, startSearch;

  startSearch = function(name) {
    var entry, input, j, len, ref, results;
    input = new RegExp(name, "i");
    ref = element("search-container").children;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      entry = ref[j];
      entry.hidden = false;
      if (!matchContent(entry, input)) {
        results.push(entry.hidden = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  matchContent = function(element, input) {
    var firstTest, secondTest, thridTest;
    firstTest = input.test(element.getElementsByClassName("mdl-card__title-text")[0].innerText);
    secondTest = input.test(element.getElementsByClassName("mdl-card__supporting-text")[0].innerText);
    thridTest = any(element.getElementsByClassName("post-category"), function(i) {
      return input.test(i.innerText);
    });
    return firstTest || secondTest || thridTest;
  };

  searchTag = function(name) {
    var entry, input, j, len, ref;
    input = new RegExp(name.srcElement.innerText, "i");
    ref = element("search-container").children;
    for (j = 0, len = ref.length; j < len; j++) {
      entry = ref[j];
      entry.hidden = false;
      if (!any(entry.getElementsByClassName("post-category"), function(i) {
        return input.test(i.innerText);
      })) {
        entry.hidden = true;
      }
    }
    return history.pushState({
      foo: "bar"
    }, "page 2", "index.html");
  };

  element("text-to-find").addEventListener("input", function() {
    return startSearch(valueof("text-to-find"));
  });

  ref = element("search-container").children;
  for (j = 0, len = ref.length; j < len; j++) {
    child = ref[j];
    ref1 = child.getElementsByClassName("post-category");
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      elem = ref1[k];
      elem.addEventListener("click", searchTag);
    }
  }

  window.onpopstate = function(event) {
    searchTag({
      srcElement: {
        innerText: ""
      }
    });
    return history.replaceState(null, "title 2");
  };

}).call(this);
