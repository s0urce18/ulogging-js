const Logger = require("ulogging").Logger;

let logger = new Logger("logger.log");

function func1(a){
    return a;
}

func1 = logger.logItLowImportance(func1)

function func2(a){
    return b;
}

func2 = logger.logItLowImportance(func2)

function func3(a){
    return b;
}

func3 = logger.logItHighImportance(func3)

logger.logHere("TEST");
func1(1);
func2(1);
func3(1);

/*
Output:
****************************************************************************************************
WORKING STARTED: Sat Jun 04 2022 10:15:20 GMT+0100
1. Sat Jun 04 2022 10:15:20 GMT+0100 <TEST>
2. Sat Jun 04 2022 10:15:20 GMT+0100 [ALL OK] <func1>(1){1} ~NO ERRORS~
3. Sat Jun 04 2022 10:15:20 GMT+0100 [ERROR (LOW IMPORTANCE)] <func2>(1) ~ERROR: b is not defined~
4. Sat Jun 04 2022 10:15:20 GMT+0100 [ERROR (!!!HIGH IMPORTANCE!!!)] <func3>(1) ~ERROR: b is not defined~
*/