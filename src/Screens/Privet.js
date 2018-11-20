import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import TextField from '@material-ui/core/TextField';

import './style.css';
import Fire from '../Fire';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

class Privet extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data: [],
            ready: false,
            open: false,
            title: "",
            imgUrl: "",
            content: ""
        }
    }

    snapshotToArray = (snapshot) => {
        let a = [];
        snapshot.forEach(function(childSnapshot) {
            let b = childSnapshot.val();
            b.key = childSnapshot.key;
            a.push(b);
        });
        return a;
    };

    componentWillMount = async () => {
        await Fire.db.ref('data/').on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                let arraySnapshot = this.snapshotToArray(snapshot);
                this.setState({
                    data: arraySnapshot,
                    ready: true,
                });
            } else {
                this.setState({
                    ready: false,
                });
            }
        })
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleAdd = async () => {
        await Fire.db.ref('data/').push({
            title: this.state.title,
            date: Date.now(),
            img: this.state.imgUrl,
            content: this.state.content,
        });
        this.handleClose();
        this.setState({
            title: "",
            imgUrl: "",
            content: ""
        })
    };

    handleDelet = async (a) => {
        Fire.db.ref('data/' + a.key).remove()
    };

    fileSelect = (e) => {
        let a = e.target.files[0];
        Fire.store.ref().child("/images/" + a.name).put(a).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
                this.setState({
                    imgUrl: url
                })
            });
        });
    };

    render() {
        return (
            <div className={'PrivetContainer'}>
                <div className={'PannelContainer'}>
                    {this.state.ready ? (this.state.data.map((a, b) => {
                        return (
                            <ExpansionPanel key={b}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{a.title}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography>
                                        {a.content}
                                    </Typography>
                                    <div className={'DeletButtonContainer'}>
                                        <Button onClick={() => this.handleDelet(a)} variant="fab" color="secondary" aria-label="Delete">
                                            <DeleteIcon />
                                        </Button>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })): (<div className={'AppSpinnerContainer'}><CircularProgress/></div>)}
                </div>
                <div className={'AddButtonContainer'}>
                    <Button onClick={this.handleClickOpen} variant="fab" color="primary" aria-label="Add" className={'AddButton'}>
                        <AddIcon />
                    </Button>
                </div>
                <Dialog
                    fullScreen={this.props.fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                className={'TextField'}
                                label="Titel"
                                value={this.state.title}
                                onChange={this.handleChange('title')}
                                margin="normal"
                            />
                            <Button variant="extendedFab" aria-label="Delete" style={{overflow: "none"}}>
                                <input type={"file"} onChange={this.fileSelect}/>
                            </Button>
                            <TextField
                                className={'TextField'}
                                label="Content"
                                multiline
                                rowsMax="4"
                                value={this.state.content}
                                onChange={this.handleChange('content')}
                                margin="normal"
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={this.handleAdd} color="primary" autoFocus>
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        )
    };
}

export default withMobileDialog()(Privet);