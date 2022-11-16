import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Overlay} from 'react-overlays';
import { Ionicons } from '@expo/vector-icons';
import TakePictureScreen from './components/TakePictureScreen';
// run: expo install expo-sqlite

export default function App() {
  [dataForDatabase, setDataForDatabase] = useState({});
  [dataFromDatabase, setDataFromDatabase] = useState('');
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
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
          <Text style={styles.header}>My Favourite Moment!</Text>
          <Text style={styles.header}>a_valsamos</Text>
          <TextInput numberOfLines={4} style={styles.textInput}  
                    onChangeText={onFavouriteClassChangeHandler} 
                    placeholder="Add your quote/caption here" />
          <Button style={styles.button}  title="Save" onPress={saveToDatabase} />
        </View>
        <View>
          <Button
            title="Open Overlay"
            onPress={toggleOverlay}
            buttonStyle={styles.button}
          />
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Text style={styles.textPrimary}>Hello!</Text>
            <Text style={styles.textSecondary}>
              Welcome to React Native Elements
            </Text>
            <Button
            />
          </Overlay>
        </View>
        <View>
          <Text style={styles.label}>CONTENTS CURRENTLY IN DB</Text>
          <Text style={styles.dbOutput}>{dataFromDatabase}</Text>
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
});