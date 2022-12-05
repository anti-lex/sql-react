import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, Image} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import TakePictureScreen from './components/TakePictureScreen';
import * as FileSystem from 'expo-file-system';
// run: expo install expo-sqlite

export default function App() {
  [dataForDatabase, setDataForDatabase] = useState({});
  [dataFromDatabase, setDataFromDatabase] = useState('');

  const [isAddMode, setIsAddMode] = useState(false);

  const [messageForFile, setMessageForFile] = useState('');
  const [messageFromFile, setMessageFromFile] = useState('-- FILE HAS NOT BEEN READ YET! --');
  var saved; 
  const [open, setOpen] = useState(false)
  const [name, setName ] = useState()
  var imgsrc = "./components/placeholder.png"
  const db = SQLite.openDatabase('myTestDB');
  useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ExampleTable2 (id INTEGER PRIMARY KEY NOT NULL, name TEXT, imageLocation TEXT);', 
          [], 
          () => console.log('TABLE CREATED!'),
          (_, result) => console.log('TABLE CREATE failed:' + result)
        );
      });

      // retrieve the current contents of the DB tables we want
      retrieveFromDatabase();
    }, 
    // add [] as extra argument to only have this fire on mount and unmount (or else it fires every render/change)
    []
  );

  onNameChangeHandler = (value) => {
    setDataForDatabase(prevState => ({ ...prevState, name: value }));
  }


  const readFromFile = () => {
    const filePath = FileSystem.documentDirectory + 'MyNewTextFile.txt';
    FileSystem.readAsStringAsync(filePath, {})
      .then((result) => {
        setMessageFromFile(result);
        console.log("File read!");
      })
      .catch((error) => {
        console.log('An error occurred: ');
        console.log(error);
      }); 
  };

  saveToDatabase = () => {
      // transaction(callback, error, success)
      db.transaction(
        tx => {
          // executeSql(sqlStatement, arguments, success, error)
          tx.executeSql("INSERT INTO ExampleTable2 (name,  imageLocation) values (?, ?)", 
            [dataForDatabase.name, FileSystem.documentDirectory + 'MyNewTextFile.txt'],
            (_, { rowsAffected }) => rowsAffected > 0 ? console.log('ROW INSERTED!') : console.log('INSERT FAILED!'),
            (_, result) => console.log('INSERT failed:' + result)
          );
        }    
      );
      saved = true;
      console.log(saved);
      retrieveFromDatabase();
  }

  retrieveFromDatabase = () => {
    db.transaction(
      tx => {
        tx.executeSql("SELECT * FROM ExampleTable2", 
          [], 
          (_, { rows }) => {    
            console.log("ROWS RETRIEVED!");

            // clear data currently stored
            setDataFromDatabase('');

            let entries = rows._array;
            console.log(entries);
            entries.forEach((entry) => {
              setDataFromDatabase(prev => prev + `${entry.id}, ${entry.name}, ${entry.imageLocation}\n`);
            });
          },
          (_, result) => {
            console.log('SELECT failed!');
            console.log(result);
          }
        )
      }
    );
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <View>
          <Text style={styles.header}>Final exam</Text>
          <Text style={styles.header}>a_valsamos</Text>
          <TouchableOpacity style = {styles.images} onPress={()=>setOpen(true)}>
            <Image source={require(imgsrc)}/>
          </TouchableOpacity>
          <View style = {styles.space}/>
          <TextInput numberOfLines={4} style={styles.textInput}  
                    onChangeText={onNameChangeHandler} 
                    placeholder="Add your quote/caption here" />
        { saved != true &&
          <Button title ="Save" onPress={()=>saveToDatabase()}/>
        }
        <Modal visible = {open}>
            <View>
                <Button title = "Click to exit" onPress={()=>setOpen(false)}/>
                <TakePictureScreen></TakePictureScreen>
                  <Button title = "click to upload!" onPress={()=>saveToDatabase()}/>
              </View>
        </Modal>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 30,
    marginTop: 60 
  },
  header: {
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center'
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center'
  },
  dbOutput: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlignVertical: 'top'
  },
  button: {
    width: '40%',
    alignContent: 'center', 
  },
  button5: {
    marginRight: '12%',
    backgroundColor: '#DEDEDE',
    borderRadius: 5,
    borderWidth: 1,
    paddingTop: '4%',
    paddingRight: '2%',
    paddingLeft: '2%',
    borderColor: '#DEDEDE',
  },  
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
  images: {
    alignContent: 'center',
    marginLeft: '18%'
  },
  space: {
    height: 40
  }
});
