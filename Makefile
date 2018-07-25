APP_NAME = inteliviajes
APK_NAME = android-release-unsigned.apk
PROJECT_PATH = ${PWD}
BUILD_APK=${PROJECT_PATH}/platforms/android/build/outputs/apk/${APK_NAME}
PASS=‘$1l3g4qw’

build-android:
	rm -rf inteliviajes.apk
	ionic cordova platform remove android
	ionic cordova platform add android
	ionic cordova build android --prod --release
	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore inteliviajes.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk inteliviajes
	~/Library/Android/sdk/build-tools/27.0.0/zipalign -v 4  platforms/android/build/outputs/apk/android-release-unsigned.apk inteliviajes.apk 
	~/Library/Android/sdk/build-tools/27.0.0/apksigner verify  inteliviajes.apk 
	  
build-ios:
	ionic cordova platform remove ios
	ionic cordova platform add ios
	ionic cordova build ios --prod --release
	open platforms/ios/Inteliviajes.xcworkspace
