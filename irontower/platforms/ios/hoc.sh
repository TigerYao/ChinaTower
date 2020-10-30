#! /usr/bash

APPNAME="铁塔换电"
BUNDLE_ID="com.chinatower.towerEle"
CONFIGURATION="Release"
PROFILE_NAME="hoc-铁塔换电"
SING_IDENTITY="iPhone Distribution: China Tower Corporation Co., Ltd. (UF473927C9)"

SCHEME="TTHD"
PLIST_FILE_PATH=./$SCHEME/$SCHEME-Info.plist
BUILD_DIR_PATH="./output" #编译目标文件夹
OPTIONS_PLIST_PATH="$BUILD_DIR_PATH/hoc.plist"

TARGET="TTHD"
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
yarn build

echo "编译完成"

cd ./platforms/ios

pwd

PBXPROJ_FILE=./$TARGET.xcodeproj/project.pbxproj
DEVELOPMENT_TEAM="UF473927C9"
PROVISIONING_PROFILE_SPECIFIER="hoc-push-铁塔换电"
CODE_SIGN_IDENTITY="iPhone Distribution"
CODE_SIGN_STYLE="Manual"

# 修改推送扩展配置
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:PRODUCT_BUNDLE_IDENTIFIER $BUNDLE_ID.push" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:DEVELOPMENT_TEAM $DEVELOPMENT_TEAM" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:PROVISIONING_PROFILE_SPECIFIER $PROVISIONING_PROFILE_SPECIFIER" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:CODE_SIGN_IDENTITY $CODE_SIGN_IDENTITY" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:E9CD5B4D248A0B2A004D2EF6:buildSettings:CODE_SIGN_STYLE $CODE_SIGN_STYLE" $PBXPROJ_FILE

PROVISIONING_PROFILE_SPECIFIER="hoc-铁塔换电"
# 修改主工程配置
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:PRODUCT_NAME $APPNAME" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:PROVISIONING_PROFILE_SPECIFIER $PROVISIONING_PROFILE_SPECIFIER" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:PRODUCT_BUNDLE_IDENTIFIER $BUNDLE_ID" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:CODE_SIGN_IDENTITY $CODE_SIGN_IDENTITY" $PBXPROJ_FILE
/usr/libexec/PlistBuddy -c "Set :objects:1D6058950D05DD3E006BFB54:buildSettings:CODE_SIGN_STYLE $CODE_SIGN_STYLE" $PBXPROJ_FILE

#修改UILaunchStoryboardName为CDVLaunchScreen
/user/libexec/PlistBuddy -c "Set :UILaunchStoryboardName CDVLaunchScreen" $PLIST_FILE_PATH
/user/libexec/PlistBuddy -c "Set :CFBundleDisplayName 铁塔换电" $PLIST_FILE_PATH

# # 多target无法同时设置多个描述文件
xcodebuild clean archive \
    -configuration $CONFIGURATION \
    -workspace $WORK_SPACE \
    -archivePath ./dist/$SCHEME.xcarchive \
    -scheme $SCHEME || exit

# DEVELOPMENT_TEAM="UF473927C9" \
# PRODUCT_BUNDLE_IDENTIFIER="${BUNDLE_ID}" \
# CODE_SIGN_IDENTITY="${SING_IDENTITY}" \
# PROVISIONING_PROFILE="${PROFILE_NAME}" \
# PROVISIONING_PROFILE_SPECIFIER="hoc-push-铁塔换电"

xcodebuild -exportArchive -archivePath ./dist/$SCHEME.xcarchive -exportPath $BUILD_DIR_PATH -exportOptionsPlist $OPTIONS_PLIST_PATH || exit

# # 上传蒲公英
curl -F "_api_key=f2299fc41f187c104c399b04577a6095" -F "file=@./$BUILD_DIR_PATH/铁塔换电.ipa" https://www.pgyer.com/apiv2/app/upload >$PGYER_TEXT_PATH

APP_NAME=$(jq -r '.data.buildName' $PGYER_TEXT_PATH)
buildVersion=$(jq -r '.data.buildVersion' $PGYER_TEXT_PATH)
buildVersionNo=$(jq -r '.data.buildVersionNo' $PGYER_TEXT_PATH)
buildIdentifier=$(jq -r '.data.buildIdentifier' $PGYER_TEXT_PATH)
buildDescription=$(jq -r '.data.buildDescription' $PGYER_TEXT_PATH)
buildQRCodeURL=$(jq -r '.data.buildQRCodeURL' $PGYER_TEXT_PATH)
buildUpdated=$(jq -r '.data.buildUpdated' $PGYER_TEXT_PATH)
buildShortcutUrl=$(jq -r '.data.buildShortcutUrl' $PGYER_TEXT_PATH)
downloadURL="https://www.pgyer.com/$buildShortcutUrl"

echo $APP_NAME

MARKDOWN_CONTENT="## 「${APP_NAME}App」更新成功
> 下载地址：**[立即更新]($downloadURL)**\n
> 版本号：**${buildVersion}**\n
> 编译版本 **${buildVersionNo}**\n
> bundleId:**${buildIdentifier}**\n
> 项目描述：**${buildDescription}**\n
> 更新时间：**${buildUpdated}**\n
> ![二维码地址：](${buildQRCodeURL})"

BODY="{\
    \"msgtype\": \"markdown\",
    \"markdown\": {
        \"content\":\"${MARKDOWN_CONTENT}\"\
    }\
}"
echo "${BODY}"

open ./$BUILD_DIR_PATH

curl 'https://oapi.dingtalk.com/robot/send?access_token=28a3c537b70109d450227c181e4784d492a9c74314b47df76c4f7bb9ac5873d8' \
    -H 'Content-Type: application/json' \
    -d "{\
    \"msgtype\": \"markdown\",
    \"markdown\": {
        \"title\": \"「铁塔换电App」更新提示\",
        \"text\": \"@15229274366,@15210963006,@18850399820${MARKDOWN_CONTENT}-\"
     },
     \"at\": {
          \"atMobiles\": [
              \"15229274366\",
              \"15210963006\",
              \"18850399820\"
          ],
          \"isAtAll\": false
      }
  }"

# # 定义常用参数
# Podfile="./Podfile"
# scheme="AutoBuild"

# # 判断是否存在podfile文件, 如果存在就执行 pod install
# Podfile="./Podfile"
# if [ -f "$Podfile" ]; then
#     pod install
# fi

# xcodebuild clean # 先把项目缓存清楚一下

# if [ -f "$Podfile" ]; then
#     xcodebuild -scheme $scheme -workspace "$scheme".xcworkspace build
#     if [ ! -d "./dist" ]; then
#         mkdir dist/archive
#     fi

#     xcodebuild archive -workspace "$scheme".xcworkspace -scheme $scheme -configuration Release -archivePath ./dist/archive.xcarchive
#     echo "编译完成"
#     echo "开始打包"
#     xcodebuild -exportArchive -archivePath ./dist/archive.xcarchive -exportPath ./dist -exportOptionsPlist ./AutoBuild/Info.plist
# fi

# exit

# # if []; then

# # fi

# pod init
# pod install
# xcodebuild -scheme AutoBuild -workspace AutoBuild.xcworkspace build
