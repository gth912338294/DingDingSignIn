/** Auto.js server running
     Auto.js:SaveToDevice
解决：
一：开屏保（解锁密码）
二：点开软件
    1.判断是否在软件内
    2.打开软件
三：切换界面
    1.判断界面&切换界面

四：点击签到
    1.判断是否签到
五：时间控制
**/

//打开钉钉
function runApp(){
    log("第一步，打开程序")
    launchApp("钉钉")
    sleep(2000);
}


//判断是否未登录 未登录则登陆
function isLogin(){
    sleep(2000);
    log("判断是否未登录")
    info = "登陆未知错误";
    var pwd_login = id("et_pwd_login").findOnce();
    if (pwd_login == null){
        info =  "账号已登录"
    }else{
        pwd_login.click()
        sleep(1000);
        pwd_login.setText("账号的密码 明文输入")
        sleep(3000);
        id("btn_next").findOnce().click();
        info = "账号未登录，已登录成功"
    }
    log(info)
}


function checkIsNow(){
    var curr_time = new Date();
    var now_Hours = curr_time.getHours();
    var now_Minutes = curr_time.getMinutes();
    var now_day = curr_time.getDay();
    if(now_day < 6){
        log("工作日")
        log("当前系统时间："+now_Hours+  +now_Minutes)

        if (now_Hours == 8 && now_Minutes >= 38)
        {
            log("正确的时间，开始进行打卡")
        }else{
            log("not this time, wait for 5 mintes")
            sleep(1000 * 60 * 5)
            checkIsNow()
        }
    }else{
        log("非工作日")
    }
}


// function openPhone(){
//     if (!device.isScreenOn()) {
//         log("息屏")
//         device.wakeUp();
//         sleep(1000); 
//         openPhone()
//     }else{
//         log("亮屏")
//     }
// }


function init_Interface(){
    swipe(500, 1000, 500, 30, 100);
    sleep(1000);
    home();
    sleep(500);
}


function go_daka(){
    isLogin();
    log("go_daka");
    work_button = desc("工作").findOnce();
    if (work_button == null){
        log("找不到工作");
        sleep(1000);
        go_daka();
    }else{
        log("找到工作");
        work_button.click(); 
        sleep(1000);
    }
}


function in_kaoqin(){
    sleep(3000)
    log("in_kaoqin")
    kaoqin_button = desc("考勤打卡").findOnce();
    if (kaoqin_button == null){
        log("找不到考勤");
        sleep(1000);
        go_daka();
        in_kaoqin();
    }else{
        log("找到考勤");
        kaoqin_button.click(); 
        sleep(1000);
    }
}
                                

function do_daka(){
    log("do_daka")
    if(className("android.view.View").desc("上班打卡").findOnce()){
        log("可以打上班卡");
        sleep(5000);
        var daka_button_set = className("android.view.View").depth("24").drawingOrder("0").indexInParent("0").desc("上班打卡").find();
        //log(daka_button_set);
        daka_button = daka_button_set[1];
        log(daka_button);
        if(daka_button == null){
            log("未找到打卡按钮");
            sleep(1000);
            do_daka();
        }else{
            log("找打打卡按钮");
            daka_button.click();
            check_is_dakaOk();
            log("打卡成功");
            sleep(1000);
        }
    }else{
        log("未找到打卡上班按钮。。。继续找");
        sleep(1000);
        do_daka();
    }
}

function check_is_dakaOk(){
    sleep(5000)
    daka_again = text("继续打卡").findOnce()
    if(daka_again != null){
        log("继续打卡")
        daka_again.click()
    }
}

function keepDrow(){
    device.wakeUpIfNeeded();
    device.keepScreenOn();
    log("尝试唤醒");
    if(!device.isScreenOn()){
        log("未唤醒");
        device.wakeUpIfNeeded();
        keepDrow();
    }
}

function do_main(){

    checkIsNow()
    device.wakeUpIfNeeded();
    auto.waitFor("fast");
    keepDrow();
    sleep(1000);

    init_Interface();
    sleep(1000);
    runApp();
    sleep(1000);
    isLogin();
    sleep(3000);
    go_daka();
    sleep(3000);
    in_kaoqin();
    sleep(3000);
    do_daka();
}

do_main()