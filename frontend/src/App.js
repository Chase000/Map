import {React, useState, useEffect} from 'react'
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useGeolocated } from "react-geolocated";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Input, Box, InputLabel } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%'
};

function MyComponent() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });
  const [selectedPark, setSelectedPark] = useState(null);
  const [selectedNow, setSelectedNow] = useState(null);

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState([])
  const [notenow, setNotenow] = useState('No Note')
  const [search, setSearch] = useState('')
  const onSubmit = (e) => {
      e.preventDefault();
      fetch('/api/v1/note/createNote', {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          latitude: Number(coords.latitude),
          longitude: Number(coords.longitude),
          content: input
        })
      })
      .then(response=> response.json())
      .then(data => setNotenow(data.content))
      setOpen(false)
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      fetch(`/api/v1/note/searchNote/${search}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response=> response.json())
    .then(data => {
      setNotes(data.notes)
      setSearch('')
    })
    } else {
      fetch('/api/v1/note/getNote', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data=>
      setNotes(data.notes)
    )
    }
  }

  useEffect(()=>{
    fetch('/api/v1/note/getNote', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data=>
      setNotes(data.notes)
    )
  }, [])

  return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
      <LoadScript
        googleMapsApiKey="AIzaSyCSo2PvnG53k2yONdpM1qlDIGG6EG3j07k"
      >
        <Grid container direction="column" align="center" justify="center">
          <Box
            
            noValidate
            autoComplete="off"
          >
            <form onSubmit={handleSubmit}>
              <InputLabel htmlFor="my-input">Search</InputLabel>
              <Input id="my-input" value={search} onChange={e => setSearch(e.target.value)} />
              <span>
                <Button type="submit" variant="contained" color="primary">
                  search
                </Button>
              </span>
            </form>
          </Box>
          <Box>
            <Button
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              variant="contained"
              onClick={handleClickOpen}
            >
              Add Note
            </Button>
          </Box>
          <Box display="flex" flexDirection="column" style={{ height: "50vh" }}>
            <h2>My Community Landmark</h2>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: Number(coords.latitude), 
                lng: Number(coords.longitude)
                }}
              zoom={13}
            >
              <Marker 
                position={{
                  lat: Number(coords.latitude), 
                  lng: Number(coords.longitude)
                  }}
                icon = {{
                  url: '/red-stars.png',
                }}
                onClick= {() => setSelectedNow({
                  user:'Chase',
                  latitude: Number(coords.latitude),
                  longitude: Number(coords.longitude),
                  content: notenow
                })}
              /> 
              
              {selectedNow && (
                <InfoWindow
                  position={{
                    lat: selectedNow.latitude,
                    lng: selectedNow.longitude
                  }}
                  onCloseClick = {() => {
                    setSelectedNow(null)
                  }}
                >
                  <div>
                    <h2>{selectedNow.user}</h2>
                    <p>{selectedNow.content}</p>
                  </div>
                </InfoWindow>
              )}
              <Dialog
                    open={open}
                    fullWidth
                    onClose={() => setOpen(false)}
                >
                    <DialogTitle>Add Note</DialogTitle>
                    <DialogContent>
                        <form onSubmit={onSubmit}>
                            <Grid container spacing={4} sx={{pt:2}}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Note"
                                        type="text"
                                        required
                                        fullWidth
                                        name="Note"
                                        value={input}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={() => setOpen(false)} disableElevation>
                                        Close
                                    </Button>
                                    <Button
                                        style={{ marginLeft: '15px' }}
                                        variant="contained"
                                        color="primary"
                                        type='submit'
                                        disableElevation
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                </Dialog>
              
              {notes.map((park, index) => (
                <Marker
                  key = {index}
                  position = {{
                    lat: park.latitude,
                    lng: park.longitude
                  }}
                  onClick = {() => {
                    setSelectedPark(park)
                  }}
                  icon = {{
                    url: park.user === 'Chase' ? '/grn-stars.png': '/blu-stars.png' ,
                  }}
                />
              ))}
              {selectedPark && (
                <InfoWindow
                  position={{
                    lat: selectedPark.latitude,
                    lng: selectedPark.longitude
                  }}
                  onCloseClick = {() => {
                    setSelectedPark(null)
                  }}
                >
                  <div>
                    <h2>{selectedPark.user}</h2>
                    <p>{selectedPark.content}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </Box>
        </Grid>
      </LoadScript>
    ) : (
      <div>Getting the location data&hellip; </div>
    );
}

export default MyComponent
