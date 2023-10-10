import React, { Fragment, useEffect } from 'react'
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import SmsAndroid from 'react-native-get-sms-android';
import { NativeModules, Platform } from "react-native";
const { fs } = RNFetchBlob;

const { RNAndroidStore, RNReactNativeGetMusicFiles } = NativeModules;
const App = () => {

  useEffect(() => {
    // console.log(fs.asset("/storage/emulated/0/Download/KoiPucheMereDilSeSadSonglHeartTouchingSaMP3160KRingtone.mp3"))
    // RNFS.readDir(fs.dirs.MainBundleDir)
    //   .then((result) => {
    //    console.log(result.length)
    //     let songs = []
    //     result.forEach(item => {
    //       var allowedExtensions = /(\.mp3|\.avi|\.mp4|\.mov|\.wmv|\.avi)$/i;
    //       if (item.isFile() && allowedExtensions.exec(item.path)) {
    //         songs.push(item)
    //       }
    //     })
    //     // console.log(songs)
    //   })

    RNFetchBlob.fs.readStream("/storage/emulated/0/Download/KoiPucheMereDilSeSadSonglHeartTouchingSaMP3160KRingtone.mp3", 'utf8', 4095)
      .then((ifstream) => {
        // ifstream.open()
        // ifstream.onData((chunk) => {
        //   // when encoding is `ascii`, chunk will be an array contains numbers
        //   // otherwise it will be a string
        //   data += chunk
        // })
        // ifstream.onError((err) => {
        //   console.log('oops', err)
        // })
        // ifstream.onEnd(() => {
        //   <Image source={{ uri: 'data:image/png,base64' + data }} />
        // })
      })
  }, [])


  useEffect(() => {
    RNFS.readDir(RNFS.DownloadDirectoryPath)
      .then((result) => {
        let songs = []
        result.forEach(item => {
          var allowedExtensions = /(\.mp3|\.avi|\.mp4|\.mov|\.wmv|\.avi)$/i;
          if (item.isFile() && allowedExtensions.exec(item.path)) {
            songs.push(item)
          }
        })
        // console.log(songs)
      })
    // console.log(RNFS.DownloadDirectoryPath)

    // RNFS.exists("/storage/emulated/0/Download/KoiPucheMereDilSeSadSonglHeartTouchingSaMP3160KRingtone.mp3", "base64")
    //   .then((response) => {
    //     console.log('response', response)
    //   })
    //   .catch((error) => {
    //     console.log('error', error)
    //   })


    // const path = RNFS.ExternalStorageDirectoryPath
    // RNFS.readDir(path)
    //   .then((rusult) => {
    //     // console.log(rusult.length)
    //   })
    // 
    // RNFS.readDir(RNFS.getAllExternalFilesDirs)
    //   .then((response) => {
    //     console.log('response', response)
    //   })

    // RNFS.getFSInfo().then((response) => { console.log('response', response) }) /// 

    // RNFS.stat('/storage/emulated/0/Download/In My City I Am Alone ! Hai Apna Dil To Awara ! Honey Singh ! Himesh Reshmiya ! Hindi ! Song.mp3')
    //   .then((response) => {
    //     console.log('response', response)
    //   })

  }, []);

  useEffect(() => {
    RNAndroidStore.getAll({
      blured: true,
      artist: true,
      duration: true,
      genre: true,
      title: true,
      cover: true,
    }, (response) => {
      // console.log(response)
    }, (error) => {
      // console.log(error)
    })


    RNAndroidStore.getArtists({},
      (response) => {
        // console.log(response)
      }, (error) => {
        // console.log(error)
      }
    )

    RNAndroidStore.getAlbums({},
      (response) => {
        // console.log(response)
      }, (error) => {
        // console.log(error)
      }
    )
    RNAndroidStore.getSong({
      // album: "Code Blue (2019)",
      artist: "Jubin Nautiyal"
    },
      (response) => {
        // console.log(response)
      }, (error) => {
        // console.log(error)
      }
    )

    RNReactNativeGetMusicFiles.getAll({
      blured: true, // works only when 'cover' is set to true
      artist: true,
      duration: true, //default : true
      genre: true,
      title: true,
      cover: true,
    },
      (response) => {
        // console.log(response)
      }, (error) => {
        // console.log(error)
      }
    )
  }, [])
  return (
    <Fragment>

    </Fragment>
  )
}

export default App;


// https://stackoverflow.com/questions/60459901/download-audio-file-in-react-native
// https://www.scaler.com/topics/react-native-fs/