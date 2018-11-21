import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CircularProgress from '@material-ui/core/CircularProgress';

import Fire from './Fire';

import Public from './Screens/Public';
import Privet from './Screens/Privet';

class App extends React.Component{

    constructor(props){
        super(props);
        Fire.init();
        window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

        this.state = {
            waitForServer: true,
            isAuth: false,
            anchorEl: null
        }
    }

    componentDidMount = () => {
        Fire.auth.onAuthStateChanged((user) => {
            this.setState({waitForServer: false});
            if (user) {
                this.setState({isAuth: true})
            } else {
                this.setState({isAuth: false})
            }
        });
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    logOut = async () => {
        try {
            await Fire.auth.signOut();
            window.location.reload();
        } catch (e) {
            console.error(e)
        }
    };

    render(){

        const open = Boolean(this.state.anchorEl);

        return(
            <div>
                <div>
                    <AppBar position="fixed" style={{background: '#333', flexGrow: 1}}>
                        <Toolbar>
                            <Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
                                PullUp Admin
                            </Typography>
                            {this.state.isAuth && (
                                <div>
                                    <IconButton
                                        aria-owns={open ? 'menu-appbar' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={open}
                                        onClose={this.handleClose}
                                    >
                                        <Typography variant={"strong"} style={{margin: 8}}>{Fire.auth.currentUser.email}</Typography>
                                        <MenuItem onClick={this.logOut}>Log Out</MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </Toolbar>
                    </AppBar>
                </div>
                <div style={{marginTop: 80}}>
                    {this.state.waitForServer ?
                        (<div className={'AppSpinnerCon'}><CircularProgress/></div>)
                        : (this.state.isAuth ? <Privet/> : <Public/>)
                    }
                </div>
            </div>
        )
    }
}

export default App;