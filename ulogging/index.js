const fs = require("fs");

class LogState{ // class with log state
    /**
     * @param {String} name name of state
     * @param {String} message message of state
     * @constructor
     */
    
    name = "";
    message = "";

    constructor(name, message){
        this.name = name;
        this.message = message;
    }
}

class LogStates{ // class with log states

    /**
     * @param {LogState} allOk when all ok
     * @param {LogState} lowImportanceError low importance error
     * @param {LogState} highImportanceError high importance error
     * @constructor
     */

    static allOk = new LogState("ALL OK", "NO ERRORS");
    static lowImportanceError = new LogState("ERROR (LOW IMPORTANCE)", "ERROR: {0}");
    static highImportanceError = new LogState("ERROR (!!!HIGH IMPORTANCE!!!)", "ERROR: {0}");
}

class Logger{

    /**
     * @param {Number} step log step
     * @param {String} fileName output file name
     * @param {String} recFormat record format for log_it
     * @param {String} errRecFormat error record format log_it
     * @param {String} hereRecFormat record format for log_here
     * @param {Boolean} noPrint no print
     * @constructor
     * @method logItLowImportance
     * @method logItHighImportance
     * @method logHere
     */

    step = null;
    fileName = null;
    recFormat = "{0}. {1} [{2}] <{3}>({4}){{5}} ~{6}~";
    errRecFormat = "{0}. {1} [{2}] <{3}>({4}) ~{5}~";
    hereRecFormat = "{0}. {1} <{2}>";
    noPrint = false;

    constructor(fileName, 
                recFormat = "{0}. {1} [{2}] <{3}>({4}){{5}} ~{6}~",
                errRecFormat = "{0}. {1} [{2}] <{3}>({4}) ~{5}~",
                hereRecFormat = "{0}. {1} <{2}>",
                noPrint = false ){
        this.step = 0;
        this.fileName = fileName;
        this.recFormat = recFormat;
        this.errRecFormat = errRecFormat;
        this.hereRecFormat = hereRecFormat;
        this.noPrint = noPrint;
        fs.appendFileSync(this.fileName, "*".repeat(100) + '\n');
        console.log("*".repeat(100));
        fs.appendFileSync(this.fileName, `WORKING STARTED: ${Date().toString()}`+ '\n');
        console.log(`WORKING STARTED: ${Date().toString()}`);
    }

    logItLowImportance(callback){
        let base = this;
        function logger(){
            base.step ++;
            try{
                let returned = callback(...arguments);
                fs.appendFileSync(base.fileName, base.recFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.allOk.name, callback.name, ...arguments, returned, LogStates.allOk.message][num]) + '\n');
                if(!base.noPrint){
                    console.log(base.recFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.allOk.name, callback.name, ...arguments, returned, LogStates.allOk.message][num]));
                }
            }
            catch(err){
                fs.appendFileSync(base.fileName, base.errRecFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.lowImportanceError.name, callback.name, ...arguments, LogStates.lowImportanceError.message.replace(/\{(\d)\}/g, err.message)][num]) + '\n');
                if(!base.noPrint){
                    console.log(base.errRecFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.lowImportanceError.name, callback.name, ...arguments, LogStates.lowImportanceError.message.replace(/\{(\d)\}/g, err.message)][num]));
                }
            }
        }
        return logger;
    }

    logItHighImportance(callback){
        let base = this;
        function logger(){
            base.step ++;
            try{
                let returned = callback(...arguments);
                fs.appendFileSync(base.fileName, base.recFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.allOk.name, callback.name, ...arguments, returned, LogStates.allOk.message][num]) + '\n');
                if(!base.noPrint){
                    console.log(base.errRecFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.allOk.name, callback.name, ...arguments, returned, LogStates.allOk.message][num]));
                }
            }
            catch(err){
                fs.appendFileSync(base.fileName, base.errRecFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.highImportanceError.name, callback.name, ...arguments, LogStates.highImportanceError.message.replace(/\{(\d)\}/g, err.message)][num]) + '\n');
                if(!base.noPrint){
                    console.log(base.errRecFormat.replace(/\{(\d)\}/g, (s, num) => [base.step, Date().toString(), LogStates.highImportanceError.name, callback.name, ...arguments, LogStates.highImportanceError.message.replace(/\{(\d)\}/g, err.message)][num]));
                }
            }
        }
        return logger;
    }

    logHere(logID){
        this.step ++;
        fs.appendFileSync(this.fileName, this.hereRecFormat.replace(/\{(\d)\}/g, (s, num) => [this.step, Date().toString(), logID][num]) + '\n');
        console.log(this.hereRecFormat.replace(/\{(\d)\}/g, (s, num) => [this.step, Date().toString(), logID][num]));
    }
}

module.exports = {Logger}