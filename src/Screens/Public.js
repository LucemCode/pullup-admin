import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.css';

import Fire from '../Fire';

import Logo from '../Assats/img/PullUp.png';

class Public extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            email: null,
            password: null,
            error: false,
            inProgress: 'none',
        }
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onSubmit = async () => {
        try {
            this.setState({inProgress: 'block'});
            await Fire.auth.signInWithEmailAndPassword(this.state.email, this.state.password)
        } catch (e) {
            console.error(e);
            this.setState({
                error: true,
                inProgress: 'none',
            })
        }
    };

    render() {
        return (
            <div>
                <Typography variant="h3" align={"center"} color="inherit">
                    PullUp
                </Typography>
                <Typography variant="body1" align={"center"} color="inherit">
                    Smart Blog Software
                </Typography>
                <div className={'CardContainer'}>
                    <Card className={'Card'}>
                        <div className={'PublicLogoContainer'}>
                            <img alt={"PullUp Logo"} src={Logo} className={"PublicLogo"}/>
                        </div>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Log In
                            </Typography>
                            <form>
                                <TextField
                                    error={this.state.error}
                                    className={'TextField'}
                                    label="Email"
                                    margin="normal"
                                    onChange={this.handleChange('email')}
                                />
                                <TextField
                                    error={this.state.error}
                                    label="Passwort"
                                    className={'TextField'}
                                    type="password"
                                    autoComplete="current-password"
                                    margin="normal"
                                    onChange={this.handleChange('password')}
                                />
                            </form>
                        </CardContent>
                        <CardActions>
                            <Button type={"submit"} size="small" color="primary" onClick={this.onSubmit}>
                                Login
                            </Button>
                            <CircularProgress style={{display: this.state.inProgress}} size={20} />
                        </CardActions>
                    </Card>
                </div>
            </div>
        )
    };
};

export default Public;