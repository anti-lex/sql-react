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

  const [open, setOpen] = useState(false)
  const [name, setName ] = useState()
  const imgsrc = "./components/placeholder.png"
  const db = SQLite.openDatabase('myTestDB');
  useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ExampleTable (id INTEGER PRIMARY KEY NOT NULL, name TEXT, age INT, favouriteQuote TEXT, favouriteClass TEXT);', 
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

  onAgeChangeHandler = (value) => {
    setDataForDatabase(prevState => ({ ...prevState, age: value }));
  }

  onFavouriteQuoteChangeHandler = (value) => {
    setDataForDatabase(prevState => ({ ...prevState, favouriteQuote: value }));
  }

  onFavouriteClassChangeHandler = (value) => {
    setDataForDatabase(prevState => ({ ...prevState, favouriteClass: value }));
  }

  const readFromFile = () => {
    const filePath = FileSystem.documentDirectory + 'MyNewTextFile.txt';
    console.log("File read!");
    FileSystem.readAsStringAsync(filePath, {})
      .then((imgsrc = FileSystem.documentDirectory + 'MyNewTextFile.txt') => {
        imgsrc = FileSystem.documentDirectory + 'MyNewTextFile.txt';
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
          tx.executeSql("INSERT INTO ExampleTable (name, age, favouriteQuote, favouriteClass) values (?, ?, ?, ?)", 
            [dataForDatabase.name, dataForDatabase.age, dataForDatabase.favouriteQuote, dataForDatabase.favouriteClass],
            (_, { rowsAffected }) => rowsAffected > 0 ? console.log('ROW INSERTED!') : console.log('INSERT FAILED!'),
            (_, result) => console.log('INSERT failed:' + result)
          );
        }    
      );
      retrieveFromDatabase();
  }

  retrieveFromDatabase = () => {
    db.transaction(
      tx => {
        tx.executeSql("SELECT * FROM ExampleTable", 
          [], 
          (_, { rows }) => {    
            console.log("ROWS RETRIEVED!");

            // clear data currently stored
            setDataFromDatabase('');

            let entries = rows._array;
            
            entries.forEach((entry) => {
              setDataFromDatabase(prev => prev + `${entry.id}, ${entry.name}, ${entry.age}, ${entry.favouriteQuote}, ${entry.favouriteClass}\n`);
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
          <Image source={require(imgsrc)}/>
          <Text style={styles.header}>My Favourite Moment!</Text>
          <Text style={styles.header}>a_valsamos</Text>
          <TextInput numberOfLines={4} style={styles.textInput}  
                    onChangeText={onFavouriteClassChangeHandler} 
                    placeholder="Add your quote/caption here" />
        {/* <View style={styles.button5}>
          <TouchableOpacity
            onPress={TakePictureScreen}>
              <Ionicons name="stop-circle" size={32} color="black" />
          </TouchableOpacity>
          <Button title ="Add Contact" color="blue" onPress={ () => setIsAddMode(true)} />
          <TakePictureScreen visible={isAddMode} onCancel={ () => setIsAddMode(false) }/>
        </View> */}
        <Button title ="Click me!" onPress={()=>setOpen(true)}/>
        <Modal visible = {open}>
            <View>
                <Button title = "Click to exit" onPress={()=>setOpen(false)}/>
                <TakePictureScreen></TakePictureScreen>
                <Button title = "click to upload!" onPress={()=>readFromFile()}/>
            </View>
        </Modal>
        <View>
          <Text style={styles.label}>CONTENTS CURRENTLY IN DB</Text>
          <Text style={styles.dbOutput}>{dataFromDatabase}</Text>
        </View>
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
});
