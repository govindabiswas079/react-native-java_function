import React, { Fragment } from 'react'
import SmsRetriever from 'react-native-sms-retriever';
import DeviceInfo from "react-native-device-info";
import Contacts from 'react-native-contacts';
import { Button, PermissionsAndroid, NativeModules, Linking, Platform, ScrollView } from 'react-native';
import CallLogs from 'react-native-call-log';
import SmsAndroid from 'react-native-get-sms-android';
import SendIntentAndroid from 'react-native-send-intent'

var DirectSms = NativeModules.DirectSms;
const DeviceContact = () => {

    const _onPhoneNumberPressed = async () => {
        try {
            const phoneNumber = await SmsRetriever.requestPhoneNumber();
            console.log(phoneNumber)
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    };

    // Get the SMS message (second gif)
    const _onSmsListenerPressed = async () => {
        try {
            const registered = await SmsRetriever.startSmsRetriever();
            if (registered) {
                console.log(registered)
                SmsRetriever.addSmsListener(event => {
                    console.log(event);
                    SmsRetriever.removeSmsListener();
                });
            }
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    };

    const _onGetPhoneNumber = async () => {
        DeviceInfo.getPhoneNumber().then((phoneNumber) => {
            console.log(phoneNumber)
            // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
        });
    };

    const _onGetContacts = async () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
            buttonPositive: 'Please accept bare mortal',
        })
            .then((res) => {
                console.log('Permission: ', res);
                Contacts.getAll()
                    .then((contacts) => {
                        // work with contacts
                        console.log(contacts);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((error) => {
                console.error('Permission error: ', error);
            });
    };

    const _onGetContactById = async () => {
        Contacts.getContactById("8861") // recordID
            .then((contacts) => {
                console.log(contacts);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _onGetCallLogs = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: 'Call Log Example',
                    message:
                        'Access your call logs',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // CallLogs.load(5).then(c => console.log(c));
                CallLogs.loadAll().then(c => console.log(c));
            } else {
                console.log('Call Log permission denied');
            }
        } catch (e) {
            console.log(e);
        }
    }

    const _GetSmsList = () => {
        SmsAndroid.list(
            JSON.stringify({
                box: '', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all

                /**
                 *  the next 3 filters can work together, they are AND-ed
                 *  
                 *  minDate, maxDate filters work like this:
                 *    - If and only if you set a maxDate, it's like executing this SQL query:
                 *    "SELECT * from messages WHERE (other filters) AND date <= maxDate"
                 *    - Same for minDate but with "date >= minDate"
                 */
                //  minDate: 1554636310165, // timestamp (in milliseconds since UNIX epoch)
                //  maxDate: 1556277910456, // timestamp (in milliseconds since UNIX epoch)
                //  bodyRegex: '(.*)How are you(.*)', // content regex to match
                //  
                //  /** the next 5 filters should NOT be used together, they are OR-ed so pick one **/
                //  read: 0, // 0 for unread SMS, 1 for SMS already read
                _id: 40395, // specify the msg id
                //  thread_id: 12, // specify the conversation thread_id
                // address: '+919511723507', // sender's phone number
                //  body: 'How are you', // content to match
                //  /** the next 2 filters can be used for pagination **/
                //  indexFrom: 0, // start from index 0
                //  maxCount: 10, // count of SMS to return each time
            }),
            (fail) => {
                console.log('Failed with this error: ' + fail);
            },
            (count, smsList) => {
                console.log('Count: ', count);
                var arr = JSON.parse(smsList);
                console.log(arr)

                // arr.forEach(function (object) {
                //     console.log('Object: ' + object);
                //     console.log('-->' + object.date);
                //     console.log('-->' + object.body);
                // });
            },
        );
    }

    const _onDeleteSms = () => {
        SmsAndroid.delete('+919511723507', (fail) => {
            console.log('Failed with this error: ' + fail);
        }, (success) => {
            console.log('SMS deleted successfully', success);
        });
    }

    const _SendSms = () => {
        SmsAndroid.autoSend("9511723507", "message",
            (fail) => {
                console.log('Failed with this error: ' + fail);
            },
            (success) => {
                console.log('SMS sent successfully');
            },
        );

        // SendSMS.send({
        //     body: 'The default body of the SMS!',
        //     recipients: ['9511723507'],
        //     successTypes: ['sent', 'queued'],
        //     allowAndroidSendWithoutReadPermission: true,
        // }, (completed, cancelled, error) => {
        // 
        //     console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
        // 
        // });
    }

    const sendDirectSms = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
                {
                    title: 'YourProject App Sms Permission',
                    message:
                        'YourProject App needs access to your inbox ' +
                        'so you can send messages in background.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                DirectSms.sendDirectSms('9511723507', 'This is a direct message');
            } else {
                console.log('SMS permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const makeCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${1299}';
        } else {
            phoneNumber = 'telprompt:${1299}';
        }

        Linking.openURL(phoneNumber);
    };


    const InitiateCall = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
                title: "App Needs Permission",
                message:
                    `Myapp needs phone call permission to dial direclty `,

                buttonNegative: "Disagree",
                buttonPositive: "Agree"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            SendIntentAndroid.sendPhoneCall("+1 234567 8900", true);
            console.log("You dialed directly");
        } else {
            console.log("No permission");
        }

    }

    const SendIntentSms = () => {
        SendIntentAndroid.sendSms("+919511723507", "SMS body text here")
    }

    const SendText = () => {
        SendIntentAndroid.sendText({
            title: "Please share this text",
            text: "Lorem ipsum dolor sit amet, per error erant eu, antiopam intellegebat ne sed",
            type: SendIntentAndroid.TEXT_PLAIN,
        });
    };

    const SendMail = () => {
        SendIntentAndroid.sendMail("govindbiswas44@gmail.com", "Subject test", "Test body");
    }

    const openWithData = () => {
        SendIntentAndroid.openAppWithData(
            "com.mxtech.videoplayer.ad",
            "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_surround-fix.avi",
            "video/*",
            {
                position: { type: "int", value: 60 },
            }
        ).then(wasOpened => { console.log(wasOpened) });
    }

    return (
        <Fragment>
            <ScrollView>
                <Button title='Phone Number' onPress={() => _onPhoneNumberPressed()} />
                <Button title='Sms Listener' onPress={() => _onSmsListenerPressed()} />
                <Button title='Get Phone Number' onPress={() => _onGetPhoneNumber()} />
                <Button title='Get Contacts' onPress={() => _onGetContacts()} />
                <Button title='Get Contact By Id' onPress={() => _onGetContactById()} />
                <Button title='Get Call Logs' onPress={() => _onGetCallLogs()} />
                <Button title='Get SMS Logs' onPress={() => _GetSmsList()} />
                <Button title='Send SMS' onPress={() => _SendSms()} />
                <Button title='Send Direct Sms' onPress={() => sendDirectSms()} />
                <Button title='Delete Sms' onPress={() => _onDeleteSms()} />
                <Button title='Make Call' onPress={() => makeCall()} />
                <Button title='Initiate Call' onPress={() => InitiateCall()} />
                <Button title='Open Settings' onPress={() => SendIntentAndroid.openSettings("android.settings.SECURITY_SETTINGS")} />
                <Button title='Send Phone Dial' onPress={() => SendIntentAndroid.sendPhoneDial("+959511723507", false)} />
                <Button title='Send Inten SMS' onPress={() => SendIntentSms()} />
                <Button title='Send Text' onPress={() => SendText()} />
                <Button title='Send Mail' onPress={() => SendMail()} />
                <Button title='is App Installed' onPress={() => SendIntentAndroid.isAppInstalled("com.google.android.gm").then(isInstalled => { console.log(isInstalled) })} />
                <Button title='Open App' onPress={() => SendIntentAndroid.openApp("com.google.android.gm").then(wasOpened => { console.log(wasOpened) })} />
                <Button title='Open With Data' onPress={() => openWithData()} />
                <Button title='open Chrome Intent' onPress={() => SendIntentAndroid.openChromeIntent("intent://www.spm.com/qrlogin#Intent;scheme=https;package=example.package;S.browser_fallback_url=https://www.spm.com/download;end").then((wasOpened) => { console.log(wasOpened) })} />
                <Button title='Open Calendar' onPress={() => SendIntentAndroid.openDownloadManager()} />
                <Button title='Open Chooser With Options' onPress={() => SendIntentAndroid.openChooserWithOptions({ subject: "Story Title", text: "Message Body", }, "Share Story")} />
                <Button title='Open Chooser With Multiple Options' onPress={() => SendIntentAndroid.openChooserWithMultipleOptions([{ subject: "Video Title", text: "Test shared with video", }, { subject: "Video Title", videoUrl: "/path_or_url/to/video.mp4", },], "Share video to")} />
                <Button title='Open Maps' onPress={() => SendIntentAndroid.openMaps("Piccadilly Circus Station, London, United Kingdom")} />
                <Button title='Request Ignore Battery Optimizations' onPress={() => SendIntentAndroid.requestIgnoreBatteryOptimizations().then(intentShown => { console.log(intentShown) })} />
                <Button title='Ignore Battery Optimizations Settings' onPress={() => SendIntentAndroid.showIgnoreBatteryOptimizationsSettings()} />
            </ScrollView>
        </Fragment>
    )
}

export default DeviceContact

// https://developer.android.com/reference/android/provider/Settings.html#ACTION_SECURITY_SETTINGS