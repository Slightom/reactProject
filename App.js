import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Picker,
  Button,
  TextInput,
  Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import PasswordInputText from 'react-native-hide-show-password-input';


const Realm = require('realm');
let urlFlights = 'http://192.168.0.103:8080/PR2-REST-server/webresources/flights';
let urlTickets = 'http://192.168.0.103:8080/PR2-REST-server/webresources/tickets';
let flights;
let tickets;

let user = null;
let data = [
  { name: 'Devin' },
  { name: 'Jackson' },
];


// Define your models and their properti
const FlightSchema = {
  name: 'Flight',
  properties: {
    id: { type: 'int', default: -1 },
    cityFrom: 'string',
    cityTo: 'string',
    startingDate: 'string',
    landindDate: 'string',
    src: 'require'
  }
};

const TicketSchema = {
  name: 'Ticket',
  properties: {
    id: { type: 'int', default: -1 },
    cityFrom: 'string',
    cityTo: 'string',
    startingDate: 'string',
    lanindDate: 'string',
    firstName: 'string',
    lastName: 'string',
    flightId: { type: 'int', default: -1 }
  }
};

const UserSchema = {
  name: 'User',
  properties: {
    login: 'string',
    password: 'string',
    firstName: 'string',
    lastName: 'string'
  }
};


class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: 'Slightom',
      password: 'Slightom20',
      errorLogin: '',
    };
  }
  componentWillMount() {
    Realm.open({ schema: [UserSchema], schemaVersion: 1 })
      .then(realm => {

        realm.write(() => {
          let allUsers = realm.objects('User');
          realm.delete(allUsers); // Deletes all cars
        });

        this.setState({ realm });

      })
      .catch(error => {
        console.log(error);
      });


    Realm.open({ schema: [UserSchema], schemaVersion: 1 })
      .then(realm => {

        realm.write(() => {
          const user = realm.create('User', {
            login: 'Slightom',
            password: 'Slightom20',
            firstName: 'Tomasz',
            lastName: 'Suchwałko'
          });
        });

        realm.write(() => {
          const user = realm.create('User', {
            login: 'Romek',
            password: 'Romek20',
            firstName: 'Romek',
            lastName: 'Kowalski'
          });
        });

        this.setState({ realm });

      })
      .catch(error => {
        console.log(error);
      });
  }

  loginClicked() {
    if (this.state.login != '' && this.state.password != '') {
      user = this.state.realm.objects('User').filtered(
        'login == "' + this.state.login + '"' +
        ' AND password == "' + this.state.password + '"');
      if (user.length > 0) {
        user = user[0];
        this.setState({ errorLogin: '' });

        this.props.navigation.navigate('Flights');

      } else {
        user = null;
        this.setState({ errorLogin: 'Wrong login or password.' });
      }
    }
    else {
      user = null;
      this.setState({ errorLogin: 'Wrong login or password.' });
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header1}> Login </Text>

        <TextInput style={styles.myTextInput} placeholder='Username'
          onChangeText={(login) => this.setState({ login })} value={this.state.login} />
        <TextInput style={styles.myTextInput} placeholder='Password' keyboardType='visible-password'
          onChangeText={(password) => this.setState({ password })} value={this.state.password}
          secureTextEntry={true} keyboardType='default' />

        <Text style={styles.errorText}>
          {this.state.errorLogin}
        </Text>

        <TouchableHighlight style={styles.myButton} onPress={() => this.loginClicked()}>
          <Text style={styles.myButtonTitle}>Login</Text>
        </TouchableHighlight >
        <TouchableHighlight style={styles.myButton}>
          <Text style={styles.myButtonTitle}>Register</Text>
        </TouchableHighlight >
      </View>
    );
  }
}


class FlightsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: 'true' };
  }

  componentWillMount() {
    return fetch(urlFlights)
      .then((response) => response.json())
      .then((responseJson) => {
        flights = responseJson;
        this.setState({
          isLoading: false
        });

      })
      .catch((error) => {
        console.error(error);
        this.setState({
          isLoading: false
        });
      });
  }

  getImagePath(city) {
    //alert(city);
    if (city === "Warszawa") {
      return require('./images/warszawa.jpg');
    }
    else if (city === "Londyn") {
      return require('./images/londyn.jpg')
    }
    else if (city === "Kraków") {
      return require('./images/kraków.jpg')
    }
    else if (city === "Amsterdam") {
      return require('./images/amsterdam.jpg')
    }
    else if (city === "Moskwa") {
      return require('./images/moskwa.jpg')
    }
    else if (city === "Lizbona") {
      return require('./images/lizbona.jpg')
    }
  }

  buyTicketClicket(flight) {
    Alert.alert(
      'Buy Ticket Confirm',
      'Do You really want buy thic ticket?',
      [
        { text: 'Yes', onPress: () => this.postTicket(flight) },
        { text: 'No' },
      ],
      { cancelable: true }
    )
  }

  postTicket(flight) {
    fetch(urlTickets, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: -1,
        cityFrom: flight.cityFrom,
        cityTo: flight.cityTo,
        startingDate: flight.startingDate,
        lanindDate: flight.landindDate,
        firstName: user.firstName,
        lastName: 'user.lastName',
        flightId: flight.id
      })
    }).then(response => {
      if (response.status === 200) {
        alert("Your just made a reservation.");
      } else {
        alert('Making reservation failed' + 'Reason: ' + response.headers.map.error);
      }
    })
  }

  goToMyTickets(){
    this.props.navigation.navigate('Tickets');
  }

  render() {
    if (this.state.isLoading) {
      return <View><Text>Loading...</Text></View>;
    }
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.myButton} onPress={() => this.goToMyTickets()}>
          <Text style={styles.myButtonTitle}>My tickets</Text>
        </TouchableHighlight >
        <FlatList
          data={flights}
          renderItem={({ item }) =>
            <View style={styles.container}>
              <TouchableOpacity style={styles.flightItem}>
                <View style={{ backgroundColor: item.id % 2 == 0 ? 'blue' : 'lightblue', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', flex: 1, height: 100 }}>
                    <Image source={this.getImagePath(item.cityFrom)} style={styles.myImage} />
                    <Image source={this.getImagePath(item.cityTo)} style={styles.myImage} />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, height: 100, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
                    <View style={{ flex: 5, height: 100, alignItems: 'flex-end', }}>
                      <Text style={styles.itemLeft}>{item.cityFrom}{"\n"}{item.startingDate}</Text>
                    </View>
                    <View style={{ flex: 1, height: 100, alignItems: 'center', }}>
                      <Text style={styles.itemMiddle}>-></Text>
                    </View>
                    <View style={{ flex: 5, height: 100, alignItems: 'flex-start', }}>
                      <Text style={styles.itemRight}>{item.cityTo}{"\n"}{item.landindDate}</Text>
                    </View>
                  </View>
                  <TouchableHighlight style={styles.myButtonGreen} onPress={() => this.buyTicketClicket(item)}>
                    <Text style={styles.myButtonTitle}>Buy Ticket</Text>
                  </TouchableHighlight >
                  <Text style={{ width: 360 }}></Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}


class TicketsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: 'true' };
  }

  componentWillMount() {
    this.getTickets();
  }

  getTickets(){
    return fetch(urlTickets + '/' + user.firstName + '/' + user.lastName)
      .then((response) => response.json())
      .then((responseJson) => {
        tickets = responseJson;
        this.setState({
          isLoading: false
        });

      })
      .catch((error) => {
        console.error(error);
        this.setState({
          isLoading: false
        });
      });
  }

  getImagePath(city) {
    if (city === "Warszawa") {
      return require('./images/warszawa.jpg');
    }
    else if (city === "Londyn") {
      return require('./images/londyn.jpg')
    }
    else if (city === "Kraków") {
      return require('./images/kraków.jpg')
    }
    else if (city === "Amsterdam") {
      return require('./images/amsterdam.jpg')
    }
    else if (city === "Moskwa") {
      return require('./images/moskwa.jpg')
    }
    else if (city === "Lizbona") {
      return require('./images/lizbona.jpg')
    }
  }

  deleteTicketClicked(ticket) {
    Alert.alert(
      'Delete Ticket Confirmation',
      'Do You really want delete this ticket?',
      [
        { text: 'Yes', onPress: () => this.deleteTicket(ticket) },
        { text: 'No' },
      ],
      { cancelable: true }
    )
  }

  deleteTicket(ticket) {
    return fetch(urlTickets + '/' + ticket.id, {
      method: 'delete'
    }).then(response =>{
      if(response.status === 200) {
        alert("Your just deleted ticket.");
        this.getTickets();
      } else {
        alert('Deleting failed');
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return <View style={styles.waitScreen}><Text>Loading...</Text></View>;
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={tickets}
          renderItem={({ item }) =>
            <View style={styles.container}>
              <TouchableOpacity style={styles.flightItem}>
                <View style={{ backgroundColor: item.id % 2 == 0 ? 'blue' : 'lightblue', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', flex: 1, height: 100 }}>
                    <Image source={this.getImagePath(item.cityFrom)} style={styles.myImage} />
                    <Image source={this.getImagePath(item.cityTo)} style={styles.myImage} />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, height: 100, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
                    <View style={{ flex: 5, height: 100, alignItems: 'flex-end', }}>
                      <Text style={styles.itemLeft}>{item.cityFrom}{"\n"}{item.startingDate}</Text>
                    </View>
                    <View style={{ flex: 1, height: 100, alignItems: 'center', }}>
                      <Text style={styles.itemMiddle}>-></Text>
                    </View>
                    <View style={{ flex: 5, height: 100, alignItems: 'flex-start', }}>
                      <Text style={styles.itemRight}>{item.cityTo}{"\n"}{item.landindDate}</Text>
                    </View>
                  </View>
                  <TouchableHighlight style={styles.myButtonRed} onPress={() => this.deleteTicketClicked(item)}>
                    <Text style={styles.myButtonTitle}>Delete Ticket</Text>
                  </TouchableHighlight >
                  <Text style={{ width: 360 }}></Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Flights: {
      screen: FlightsScreen,
    },
    Tickets: {
      screen: TicketsScreen,
    }
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  waitScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  header1: {
    fontSize: 36,
    color: 'black',
    marginBottom: 40,
  },
  myTextInput: {
    width: 260,
    fontSize: 28,
  },
  myImage: {
    flex: 1
    // height: 140,
    // width: 140,
  },
  errorText: {
    color: 'red',
    fontSize: 24,
  },
  myButton: {
    backgroundColor: '#17BAFF',
    width: 260,
    marginTop: 20,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  myButtonRed: {
    backgroundColor: 'red',
    width: 260,
    marginTop: 20,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  myButtonGreen: {
    backgroundColor: 'green',
    width: 260,
    marginTop: 20,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  myButton2: {
    backgroundColor: '#17BAFF',
    flex: 1,
    marginTop: 20,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  myButtonTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    //padding: 20, 
    fontSize: 28,
    color: 'yellow'
  },
  itemLeft: {
    textAlign: 'right',
    fontSize: 28,
    color: 'yellow',
  },
  itemMiddle: {
    textAlign: 'center',
    fontSize: 28,
    color: 'yellow',
  },
  itemRight: {
    textAlign: 'left',
    fontSize: 28,
    color: 'yellow',
  },
  flightItem: {
    flex: 1,
    borderColor: 'green',
    borderBottomWidth: 6,
  },
  item2: {
    padding: 20,
    fontSize: 28,
    height: 520,
  },
  headerBelt: {
    height: 25,
    backgroundColor: 'green',
  },
});
