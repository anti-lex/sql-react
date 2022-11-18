import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import ImageSelector from '../components/ImageSelector';

const TakePictureScreen = () => {
    const [selectedImage, setSelectedImage] = useState();
    const [availableStorage, setAvilableStorage] = useState(0);
    const [totalStorage, setTotalStorage] = useState(0);

    FileSystem.getFreeDiskStorageAsync().then(freeDiskStorage => {
        // calculate size in GB
        setAvilableStorage(freeDiskStorage / 1073741824);
      });
    
      FileSystem.getTotalDiskCapacityAsync().then(totalDiskCapacity => {
        // calculate size in GB
        setTotalStorage(totalDiskCapacity / 1073741824);
      });

    const saveToFile = messageForFile => {
        const filePath = FileSystem.documentDirectory + 'MyNewTextFile.txt';
        FileSystem.writeAsStringAsync(filePath, messageForFile, {})
          .then(() => {
            console.log('File was written!');
          })
          .catch((error) => {
            console.log('An error occurred: ');
            console.log(error);
          }); 
      };
    const imageSelectedHandler = imagePath => {
        setSelectedImage(imagePath);
        saveToFile(imagePath)
    }

    return (
        <View>
            <View style={styles.form}>
                <Text style={styles.label}>Lets Take a picture!</Text>
                { !selectedImage && 
                    <ImageSelector onImageSelected={imageSelectedHandler} /> 
                }
                { selectedImage && 
                    <View>
                        <Image style={styles.image} source={{ uri: selectedImage }} />
                        <Button title="Reset" onPress={() => { setSelectedImage(null); }} />
                    </View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center'
    },
    image: {
        width: 400,
        height: 400
    }
});

export default TakePictureScreen;