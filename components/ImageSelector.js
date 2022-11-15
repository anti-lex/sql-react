import React from 'react';
import { View, Button, StyleSheet, Alert, CameraRoll } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// The following are required for access to the camera:
// expo install expo-image-picker
// expo install expo-permissions

const ImageSelector = props => {
    const verifyPermissions = async () => {
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        const libraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(cameraResult.status !== 'granted' && libraryResult.status !== 'granted') {
            Alert.alert('Insufficient Permissions!', 'You need to grant camera permissions to use this app.', [{ text: 'Okay' }]);
            return false;
        }
        return true;
    }

    const retrieveImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission) {
            return false;
        }
        
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        });

        if (!image.cancelled) {
            props.onImageSelected(image.uri);
        }
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission) {
            return false;
        }
        
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });

        if (!image.cancelled) {
            props.onImageSelected(image.uri);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button style={styles.button} title="Retrieve From Gallery" onPress={retrieveImageHandler} />
                <Button style={styles.button} title="Take Image" onPress={takeImageHandler} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        height: 250
    },
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '100%',
      minHeight: 100
    },
    button: {
        paddingVertical: 25,
        width: '100%',
    }
});

export default ImageSelector;