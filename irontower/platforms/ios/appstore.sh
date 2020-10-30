#! /usr/bash

APPNAME="铁塔换电"
BUNDLE_ID="com.chinatower.towerEle"
CONFIGURATION="Release"
PROFILE_NAME="AppStore-铁塔换电"
SING_IDENTITY="iPhone Distribution: China Tower Corporation Co., Ltd. (UF473927C9)"

SCHEME="铁塔换电"
PLIST_FILE_PATH=./铁塔换电/铁塔换电-Info.plist
BUILD_DIR_PATH="./output" #编译目标文件夹
OPTIONS_PLIST_PATH="$BUILD_DIR_PATH/appstore.plist"

TARGET="铁塔换电"
WORK_SPACE="$SCHEME.xcworkspace"
XCODE_PROJECT="$SCHEME.xcodeproj"
PGYER_TEXT_PATH=./$BUILD_DIR_PATH/pgyer.text

if ! command -v git >/dev/null; then
    echo "不存在git命令"
    exit
fi

# # 判断是否安装pod命令
# if ! command -v pod >/dev/null 2>&1; then
#     echo "请在内置环境安装pod命令"
#     exit
# fi

# if [ ! -d $BUILD_DIR_PATH ]; then
#     mkdir $BUILD_DIR_PATH
# fi

cd ../../../
git pull
cd ./irontower
# yarn build

cd ./platforms/ios

# 修改版本为生产版本
sed -i "" "s/<\/head>/<script>window.prefix = 'http:\/\/fx.chinatowercom.cn:8091'<\/script><\/head>/g" ./www/index.html

pwd
#修改UILaunchStoryboardName为CDVLaunchScreen
/user/libexec/PlistBuddy -c "Set UILaunchStoryboardName CDVLaunchScreen" ./铁塔换电/铁塔换电-Info.plist

PBXPROJ_FILE=./$TARGET.xcodeproj/project.pbxproj
DEVELOPMENT_TEAM="UF473927C9"
PROVISIONING_PROFILE_SPECIFIER="push-dis"
CODE_SIGN_IDENTITY="iPhone Distribution"
CODE_SIGN_STYLE="Manual"

# 修改推送扩展配置
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:PRODUCT_BUNDLE_IDENTIFIER $BUNDLE_ID.push" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:DEVELOPMENT_TEAM $DEVELOPMENT_TEAM" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:PROVISIONING_PROFILE_SPECIFIER $PROVISIONING_PROFILE_SPECIFIER" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:CODE_SIGN_IDENTITY $CODE_SIGN_IDENTITY" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:CODE_SIGN_STYLE $CODE_SIGN_STYLE" $PBXPROJ_FILE

PROVISIONING_PROFILE_SPECIFIER=$PROFILE_NAME
# 修改主工程配置
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:PRODUCT_NAME $APPNAME" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:PROVISIONING_PROFILE_SPECIFIER $PROVISIONING_PROFILE_SPECIFIER" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:PRODUCT_BUNDLE_IDENTIFIER $BUNDLE_ID" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:CODE_SIGN_IDENTITY $CODE_SIGN_IDENTITY" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:CODE_SIGN_STYLE $CODE_SIGN_STYLE" $PBXPROJ_FILE

# cat ./铁塔换电/铁塔换电-Info.plist

# # 多target无法同时设置多个描述文件
xcodebuild clean archive \
    -configuration $CONFIGURATION \
    -workspace $WORK_SPACE \
    -archivePath ./output/$SCHEME.xcarchive \
    -scheme $SCHEME || exit

xcodebuild -exportArchive -archivePath ./output/$SCHEME.xcarchive -exportPath $BUILD_DIR_PATH -exportOptionsPlist $OPTIONS_PLIST_PATH || exit

mv ./output/铁塔换电.ipa ./output/TTHD-Appstore.ipa
