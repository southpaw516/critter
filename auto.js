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
};
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
};

function autoCritter() {

    if (this.game.femaleMound().length > 0) {
        mother = this.game.mother();
        female = this.game.femaleMound()[0];
        queenButton = document.getElementsByClassName('female one')[0];
        femaleWorkerButton = document.getElementsByClassName('mine')[1];
        femaleSoldierButton = document.getElementsByClassName('army')[1];
        console.log('Female');
        kidSelect(mother, female, queenButton, femaleWorkerButton, femaleSoldierButton);
    }
    if (this.game.maleMound().length > 0) {
        father = this.game.father();
        male = this.game.maleMound()[0];
        kingButton = document.getElementsByClassName('male one')[0];
        maleWorkerButton = document.getElementsByClassName('mine')[2];
        maleSoldierButton = document.getElementsByClassName('army')[2];
        console.log('Male');
        kidSelect(father, male, kingButton, maleWorkerButton, maleSoldierButton);
    }

    autoUpgrade();

    //autoWar();
}

function kidSelect(parent, child, parentButton, workerButton, soldierButton) {
    keep = false;

    if (child.score > parent.score) {
        if (child.totalMutations >= parent.totalMutations) {
            console.log('Move to parent  ' + parent.score + ' --> ' + child.score);
            simulate(parentButton, 'click');
            keep = true;
        }
    } else if (child.totalMutations > parent.totalMutations) {
        console.log('Move to parent new mutation score ' + parent.score + ' --> ' + child.score);
        simulate(parentButton, 'click');
        keep = true;
    }
    if (keep === false) {
        if (this.game.armyMound().length < this.game.maxArmyMoundSize() &&
            child.score > this.game.nations().filter(isWarTarget).sort(sort_by('highBaseValue', false, parseInt))[0].highBaseValue) {
            console.log('Move to soldier');
            simulate(soldierButton, 'click');
        } else {
            console.log('Move to worker');
            simulate(workerButton, 'click');
        }
    }
}

sort_by = function(field, reverse, primer) {

    var key = primer ? function(x) {
            return primer(x[field]);
        } : function(x) {
            return x[field];
        };

    reverse = !reverse ? 1 : -1;

    return function(a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
};

function autoUpgrade() {

    soldierButton = document.getElementsByClassName('upgrade')[8];
    soldierCost = this.game.armyMoundUpgradeCost();
    autoUpgradeEvent(soldierCost, soldierButton, 'Army');

    factoryButton = document.getElementsByClassName('upgrade')[7];
    factoryCost = this.game.factoryMoundUpgradeCost();
    autoUpgradeEvent(factoryCost, factoryButton, 'Factory');

    carrierButton = document.getElementsByClassName('upgrade')[6];
    carrierCost = this.game.carrierMoundUpgradeCost();
    autoUpgradeEvent(carrierCost, carrierButton, 'Carrier');

    farmButton = document.getElementsByClassName('upgrade')[5];
    farmCost = this.game.farmMoundUpgradeCost();
    autoUpgradeEvent(farmCost, farmButton, 'Farm');

    mineButton = document.getElementsByClassName('upgrade')[4];
    mineCost = this.game.mineMoundUpgradeCost();
    autoUpgradeEvent(mineCost, mineButton, 'Mine');
}

function autoUpgradeEvent(upgradeCost, button, type) {
    if (this.game.sod() >= upgradeCost) {
        console.log(type + ' Upgraded for ' + upgradeCost);
        simulate(button, 'click');
    }
}

function autoWar() {
    nationsSort = this.game.nations().filter(isWarTarget).sort(sort_by('highBaseValue', false, parseInt));
    //for (i = 0; i < nationsSort.length; i++) {
    //    console.log(nationsSort[i].name + ' ' + nationsSort[i].highBaseValue + ' Defeated: ' + nationsSort[i].isDefeated());
    //}

    if (nationsSort.length > 0)
        console.log('Next to Fight: ' + nationsSort[0].name);

    //add check for if at 2
    if (this.game.atWar() !== true) {
        buttonIndex = document.getElementsByClassName('critterRow').length - 2;
        for (i = this.game.armyMound().length - 1; i > 1; i--) {

            if (this.game.armyMound()[i].score <= nationsSort[0].highBaseValue) {
                critterButton = document.getElementsByClassName('critterRow')[buttonIndex];
                simulate(critterButton, 'click');

            }
            console.log(i);
            buttonIndex--;
        }

        recycleButton = document.getElementsByClassName('recycle')[8];
        simulate(recycleButton, 'click');

        if (this.game.armyMound().length == this.game.maxArmyMoundSize()) {
            button = document.getElementsByClassName('war unlocked')[0];
            //simulate(button, 'click');
        }
    }
    if (this.game.atWar() && this.game.map().completePercentage() == '100%') {
        this.game.EndWar();
    }
}

function isWarTarget(value) {
    if (value.isDefeated() !== true && value.isUnlocked() === true)
        return value;
}

function fakeFilter(value) {
    return value;
}

function printNations() {
    nationsSortPrint = this.game.nations().filter(fakeFilter).sort(sort_by('highBaseValue', false, parseInt));
    for (i = 0; i < nationsSortPrint.length; i++) {
        for (var key in nationsSortPrint[i]) {
            if (key === 'highBaseValue' || key === 'name')
                console.log(key + ': ' + nationsSortPrint[i][key]);
            else if (key === 'isDefeated' || key === 'isUnlocked')
                console.log(key + ': ' + nationsSortPrint[i][key]());
        }
        console.log('---------------------');
    }
}

function autoStart() {
    activeTimer = setInterval(autoCritter, 2000);
}

function autoStop() {
    clearInterval(activeTimer);
}
