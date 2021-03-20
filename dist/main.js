/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Grid
const draw_grid = function (ctx, canvas_rect, tile_size) {
  for (var i = 1; i < (canvas_rect.height / tile_size); i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * tile_size)
    ctx.lineTo(canvas_rect.right, i * tile_size)
    ctx.stroke();
  }

  for (var i = 1; i < (canvas_rect.width / tile_size); i++) {
    ctx.beginPath()
    ctx.moveTo(i * tile_size, 0)
    ctx.lineTo(i * tile_size, canvas_rect.bottom)
    ctx.stroke();
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (draw_grid);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _grid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid.js */ "./src/grid.js");
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

// Constants
const canvas_rect = canvas.getBoundingClientRect()
const tile_size = 20;
const SCREEN_WIDTH = canvas_rect.width;
const SCREEN_HEIGHT = canvas_rect.height;

const draw_square = function (x = 10, y = 10, w = 20, h = 20, color = "rgb(190, 20, 10)") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

;

var character = {
  x: tile_size * (Math.floor(canvas_rect.width / tile_size) / 2),
  y: tile_size * (Math.floor(canvas_rect.height / tile_size) / 2),
  moving: false
}

var target_movement = {
  x: 0,
  y: 0
}

const on_click = function (ev) {
  target_movement.x = ev.clientX
  target_movement.y = ev.clientY
  character.moving = true
}

canvas.addEventListener("click", on_click, false);
// debugger function
window.addEventListener("keyup", function (e) {
  console.log(character)
  console.log(target_movement)
}, false)

const distance = function (a, b) {
  return Math.abs(Math.floor(a) - Math.floor(b));
}

const clear_screen = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const spawn_creep = function () {
}

function game_loop() {
  clear_screen()
  //draw_grid(ctx, canvas_rect, tile_size);

  // Character Movement
  if (character.moving) {
    if ((distance(character.x, target_movement.x) <= 1) && (distance(character.y, target_movement.y) <= 1)) {
      character.moving = false;
      console.log("Stopped");
    }
    // If the distance from the character position to the target is 1 or less
    if (distance(character.x, target_movement.x) > 1) {
      if (character.x > target_movement.x) {
        character.x = character.x - 2;
      } else {
        character.x = character.x + 2;
      }
    }
    if (distance(character.y, target_movement.y) > 1) {
      if (character.y > target_movement.y) {
        character.y = character.y - 2;
      } else {
        character.y = character.y + 2;
      }
    }
  }
  // END - Character Movement

  // First base
  draw_square(0, tile_size * 30, tile_size * 6, tile_size * 6)

  // Second base
  draw_square(tile_size * (Math.floor(canvas_rect.right / tile_size) - 6), 0, tile_size * 6, tile_size * 6)

  // Draw character
  draw_square(character.x,
    character.y,
    20, 20, "blueviolet"
  );

  requestAnimationFrame(game_loop)
};

requestAnimationFrame(game_loop)

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9udWJhcmlhLy4vc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9udWJhcmlhL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnViYXJpYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL251YmFyaWEvLi9zcmMvZ2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQSxpQkFBaUIsc0NBQXNDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHFDQUFxQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7O1VDakJ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFrQzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR3JpZFxuY29uc3QgZHJhd19ncmlkID0gZnVuY3Rpb24gKGN0eCwgY2FudmFzX3JlY3QsIHRpbGVfc2l6ZSkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IChjYW52YXNfcmVjdC5oZWlnaHQgLyB0aWxlX3NpemUpOyBpKyspIHtcbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHgubW92ZVRvKDAsIGkgKiB0aWxlX3NpemUpXG4gICAgY3R4LmxpbmVUbyhjYW52YXNfcmVjdC5yaWdodCwgaSAqIHRpbGVfc2l6ZSlcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMTsgaSA8IChjYW52YXNfcmVjdC53aWR0aCAvIHRpbGVfc2l6ZSk7IGkrKykge1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5tb3ZlVG8oaSAqIHRpbGVfc2l6ZSwgMClcbiAgICBjdHgubGluZVRvKGkgKiB0aWxlX3NpemUsIGNhbnZhc19yZWN0LmJvdHRvbSlcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhd19ncmlkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJyk7XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuLy8gQ29uc3RhbnRzXG5jb25zdCBjYW52YXNfcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuY29uc3QgdGlsZV9zaXplID0gMjA7XG5jb25zdCBTQ1JFRU5fV0lEVEggPSBjYW52YXNfcmVjdC53aWR0aDtcbmNvbnN0IFNDUkVFTl9IRUlHSFQgPSBjYW52YXNfcmVjdC5oZWlnaHQ7XG5cbmNvbnN0IGRyYXdfc3F1YXJlID0gZnVuY3Rpb24gKHggPSAxMCwgeSA9IDEwLCB3ID0gMjAsIGggPSAyMCwgY29sb3IgPSBcInJnYigxOTAsIDIwLCAxMClcIikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3LCBoKTtcbn1cblxuaW1wb3J0IGRyYXdfZ3JpZCBmcm9tIFwiLi9ncmlkLmpzXCI7XG5cbnZhciBjaGFyYWN0ZXIgPSB7XG4gIHg6IHRpbGVfc2l6ZSAqIChNYXRoLmZsb29yKGNhbnZhc19yZWN0LndpZHRoIC8gdGlsZV9zaXplKSAvIDIpLFxuICB5OiB0aWxlX3NpemUgKiAoTWF0aC5mbG9vcihjYW52YXNfcmVjdC5oZWlnaHQgLyB0aWxlX3NpemUpIC8gMiksXG4gIG1vdmluZzogZmFsc2Vcbn1cblxudmFyIHRhcmdldF9tb3ZlbWVudCA9IHtcbiAgeDogMCxcbiAgeTogMFxufVxuXG5jb25zdCBvbl9jbGljayA9IGZ1bmN0aW9uIChldikge1xuICB0YXJnZXRfbW92ZW1lbnQueCA9IGV2LmNsaWVudFhcbiAgdGFyZ2V0X21vdmVtZW50LnkgPSBldi5jbGllbnRZXG4gIGNoYXJhY3Rlci5tb3ZpbmcgPSB0cnVlXG59XG5cbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25fY2xpY2ssIGZhbHNlKTtcbi8vIGRlYnVnZ2VyIGZ1bmN0aW9uXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGNvbnNvbGUubG9nKGNoYXJhY3RlcilcbiAgY29uc29sZS5sb2codGFyZ2V0X21vdmVtZW50KVxufSwgZmFsc2UpXG5cbmNvbnN0IGRpc3RhbmNlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIE1hdGguYWJzKE1hdGguZmxvb3IoYSkgLSBNYXRoLmZsb29yKGIpKTtcbn1cblxuY29uc3QgY2xlYXJfc2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG59XG5cbmNvbnN0IHNwYXduX2NyZWVwID0gZnVuY3Rpb24gKCkge1xufVxuXG5mdW5jdGlvbiBnYW1lX2xvb3AoKSB7XG4gIGNsZWFyX3NjcmVlbigpXG4gIC8vZHJhd19ncmlkKGN0eCwgY2FudmFzX3JlY3QsIHRpbGVfc2l6ZSk7XG5cbiAgLy8gQ2hhcmFjdGVyIE1vdmVtZW50XG4gIGlmIChjaGFyYWN0ZXIubW92aW5nKSB7XG4gICAgaWYgKChkaXN0YW5jZShjaGFyYWN0ZXIueCwgdGFyZ2V0X21vdmVtZW50LngpIDw9IDEpICYmIChkaXN0YW5jZShjaGFyYWN0ZXIueSwgdGFyZ2V0X21vdmVtZW50LnkpIDw9IDEpKSB7XG4gICAgICBjaGFyYWN0ZXIubW92aW5nID0gZmFsc2U7XG4gICAgICBjb25zb2xlLmxvZyhcIlN0b3BwZWRcIik7XG4gICAgfVxuICAgIC8vIElmIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjaGFyYWN0ZXIgcG9zaXRpb24gdG8gdGhlIHRhcmdldCBpcyAxIG9yIGxlc3NcbiAgICBpZiAoZGlzdGFuY2UoY2hhcmFjdGVyLngsIHRhcmdldF9tb3ZlbWVudC54KSA+IDEpIHtcbiAgICAgIGlmIChjaGFyYWN0ZXIueCA+IHRhcmdldF9tb3ZlbWVudC54KSB7XG4gICAgICAgIGNoYXJhY3Rlci54ID0gY2hhcmFjdGVyLnggLSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hhcmFjdGVyLnggPSBjaGFyYWN0ZXIueCArIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkaXN0YW5jZShjaGFyYWN0ZXIueSwgdGFyZ2V0X21vdmVtZW50LnkpID4gMSkge1xuICAgICAgaWYgKGNoYXJhY3Rlci55ID4gdGFyZ2V0X21vdmVtZW50LnkpIHtcbiAgICAgICAgY2hhcmFjdGVyLnkgPSBjaGFyYWN0ZXIueSAtIDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGFyYWN0ZXIueSA9IGNoYXJhY3Rlci55ICsgMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gRU5EIC0gQ2hhcmFjdGVyIE1vdmVtZW50XG5cbiAgLy8gRmlyc3QgYmFzZVxuICBkcmF3X3NxdWFyZSgwLCB0aWxlX3NpemUgKiAzMCwgdGlsZV9zaXplICogNiwgdGlsZV9zaXplICogNilcblxuICAvLyBTZWNvbmQgYmFzZVxuICBkcmF3X3NxdWFyZSh0aWxlX3NpemUgKiAoTWF0aC5mbG9vcihjYW52YXNfcmVjdC5yaWdodCAvIHRpbGVfc2l6ZSkgLSA2KSwgMCwgdGlsZV9zaXplICogNiwgdGlsZV9zaXplICogNilcblxuICAvLyBEcmF3IGNoYXJhY3RlclxuICBkcmF3X3NxdWFyZShjaGFyYWN0ZXIueCxcbiAgICBjaGFyYWN0ZXIueSxcbiAgICAyMCwgMjAsIFwiYmx1ZXZpb2xldFwiXG4gICk7XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVfbG9vcClcbn07XG5cbnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lX2xvb3ApXG4iXSwic291cmNlUm9vdCI6IiJ9