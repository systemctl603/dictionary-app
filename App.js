import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { Header } from "react-native-elements";

const styles = StyleSheet.create({
  textBox: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    marginTop: "40px",
    marginLeft: "auto",
    width: "100%",
    marginRight: "auto",
    textAlign: "center",
  },
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      typing: true,
      word: "",
      def: "",
      type: "",
    };
  }
  async getDefOfWord(word) {
    let uri = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    let res = await fetch(`https://cors-anywhere.herokuapp.com/${uri}`);
    console.log(res);
    if (res.ok) {
      let json = await res.json();
      this.setState({ loaded: true });
      return json[0].meanings[0];
    } else {
      console.log(res);
      return null;
    }
  }

  render() {
    return (
      <View>
        <StatusBar style="auto" />
        <Header centerComponent={{ text: "Pocket Dictionary" }} />
        <TextInput
          style={styles.textBox}
          onChangeText={(text) => this.setState({ word: text, typing: true })}
        />
        <Button
          title="Search"
          onPress={async () => {
            let response = await this.getDefOfWord(this.state.word);
            if (response === null) {
              alert("No word found");
              return;
            }
            this.setState({ typing: false });
            console.log(response);
            var partOfSpeech = response.partOfSpeech;
            var definition = response.definitions[0].definition;

            partOfSpeech =
              partOfSpeech[0].toUpperCase() + partOfSpeech.slice(1);
            console.log(partOfSpeech, definition);
            this.setState({ type: partOfSpeech });
            this.setState({ def: definition });
            this.setState({ loaded: true });
          }}
        />
        <Text style={{ fontStyle: "bold", color: "green", fontSize: 30 }}>
          {this.state.loaded ? "Word: " : ""}
          <Text style={{ fontSize: 25, color: "blue" }}>
            {this.state.loaded && !this.state.typing ? this.state.word : ""}
          </Text>
        </Text>
        <Text style={{ fontStyle: "bold", color: "green", fontSize: 30 }}>
          {this.state.loaded ? "Defenition: " : ""}
          <Text style={{ fontSize: 25, color: "blue" }}>
            {this.state.loaded ? this.state.def : ""}
          </Text>
        </Text>
        <Text style={{ fontStyle: "bold", color: "green", fontSize: 30 }}>
          {this.state.loaded ? "Lexical Group: " : ""}
          <Text style={{ fontSize: 25, color: "blue" }}>
            {this.state.loaded ? this.state.type : ""}
          </Text>
        </Text>
      </View>
    );
  }
}
