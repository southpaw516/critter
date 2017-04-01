function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            break;
        }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    } else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

    function autoCritter() {
        keepFemale = false;
        keepMale = false;
        queenScore = this.game.mother().score;
        console.log('Queen Score: ' + queenScore);

        kingScore = this.game.father().score;
        console.log('King Score: ' + kingScore);

        queenButton = document.getElementsByClassName('female one')[0];
        femaleWorkerButton = document.getElementsByClassName('mine')[1];
		femaleSoldierButton = document.getElementsByClassName('army')[1];
        kingButton = document.getElementsByClassName('male one')[0];
        maleWorkerButton = document.getElementsByClassName('mine')[2];
		maleSoldierButton = document.getElementsByClassName('army')[2];
		
        if (this.game.femaleMound().length > 0) {
            female1 = this.game.femaleMound()[0].score;
            if (female1 > queenScore) {
                if (this.game.femaleMound()[0].totalMutations >= this.game.mother().totalMutations) {
                    keepFemale = true;
                }
            }
			else if (this.game.femaleMound()[0].totalMutations > this.game.mother().totalMutations) {
                keepFemale = true;
            }
            if (keepFemale === false) {
				if (this.game.armyMound().length < this.game.maxArmyMoundSize()) {
					console.log('false Soldier');
					simulate(femaleSoldierButton, 'click');
				}
				else {
					console.log('false');
					simulate(femaleWorkerButton, 'click');
				}
            }
			else {
				console.log('true');
                simulate(queenButton, 'click');
			}
        }
        if (this.game.maleMound().length > 0) {
            male1 = this.game.maleMound()[0].score;
            if (male1 > kingScore) {
                if (this.game.maleMound()[0].totalMutations >= this.game.father().totalMutations) {
                    keepMale = true;
                }
            }
			else if (this.game.maleMound()[0].totalMutations > this.game.father().totalMutations) {
                    keepMale = true;
                }
            if (keepMale === false) {
				if (this.game.armyMound().length < this.game.maxArmyMoundSize()) {
					console.log('false Soldier');
					simulate(maleSoldierButton, 'click');
				}
				else {
					console.log('false');
					simulate(maleWorkerButton, 'click');
				}
            }
			else {
				console.log('true');
                simulate(kingButton, 'click');
			}
        }
		
		if (this.game.atWar() && this.game.map().completePercentage() == '100%') {
			this.game.EndWar();
		}
			
    }

function autoStart() {
    activeTimer = setInterval(autoCritter, 5000);
}

function autoStop() {
    clearInterval(activeTimer);
}