import React, { useState, useEffect, Fragment } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    PermissionsAndroid,
    ActivityIndicator,
} from 'react-native';

import RNFS from 'react-native-fs';

const GetAllPDF = ({ navigation }) => {
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        readStorage(RNFS.ExternalStorageDirectoryPath);
    }, []);

    const readStorage = async (path) => {
        await RNFS.readDir(path)
            .then(result => {
                result.forEach((item, index) => {
                    if (item.name.endsWith('.pdf')) {
                        setBookList((prev) => [...prev, item])
                    } else if (item.isDirectory()) {
                        readStorage(item?.path)
                    }
                });
            })
            .catch(error => {
                console.log('error', error);
            });
    };

    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }
    
    return (
        <Fragment>
            {bookList.length == 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={{ /* justifyContent: "flex-start", alignItems: "flex-start", */ width: "100%" }}>
                    <Text>{getUniqueListBy(bookList, "name").length}</Text>
                    <ScrollView style={styles.images}>
                        {getUniqueListBy(bookList, "name")?.sort(function (a, b) { return new Date(b?.mtime) - new Date(a?.mtime); })?.map((item, index) => (
                            <View key={index} style={{ display: 'flex', flexDirection: 'column', marginVertical: 10, padding: 10, height: 50, backgroundColor: 'blue', width: "100%" /* gap: '12px'  */ }}>
                                <Text style={{ color: "#FFFFFF", fontWeight: "500", fontSize: 14 }}>{item?.name}</Text>
                                <Text style={{ color: "#FFFFFF", fontWeight: "400", fontSize: 12 }}>{(item?.size / 1024).toFixed(0)} kb</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </Fragment>
    )
};

export default GetAllPDF;

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height - 110,
        //  padding: 5,
    },
    list: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 1,
    },
});
