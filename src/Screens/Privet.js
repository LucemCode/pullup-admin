import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import TextField from '@material-ui/core/TextField';

import snapshotToArray from '../Components/FirebaseDBSnapshotToArray';
import './style.css';
import Fire from '../Fire';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

class Privet extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data: [],
            ready: false,
            addDialogOpen: false,
            editDialogOpen: false,
            imgObjekt: null,
            safeProgress: 0,
            key: "",
            title: "",
            imgUrl: "",
            content: ""
        }
    }

    componentWillMount = async () => {
        await Fire.db.ref('data/').on('value', (snapshot) => {
            let arraySnapshot = snapshotToArray(snapshot);
            this.setState({
                data: arraySnapshot,
                ready: true,
            });
        })
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleEdit = (a) => {
        this.setState({
            editDialogOpen: true,
            key: a.key,
            title: a.title,
            imgUrl: a.img,
            content: a.content
        })
    };

    handleEditSubmit = async () => {
        await Fire.db.ref('data/'+ this.state.key).set({
            title: this.state.title,
            img: this.state.imgUrl,
            content: this.state.content,
        });
        this.setState({
            editDialogOpen: false,
            title: "",
            imgUrl: "",
            content: "",
            key: ""
        })
    };

    handleAddSubmit = async () => {
        if (this.state.title && this.state.content !== "") {
            this.setState({safeProgress: 1});
            await Fire.store.ref().child("/images/" + this.state.imgObjekt.name).put(this.state.imgObjekt).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {
                    this.setState({
                        imgUrl: url
                    })
                });
            }).then(
                await Fire.db.ref('data/').push({
                    title: this.state.title,
                    date: Date.now(),
                    img: this.state.imgUrl,
                    content: this.state.content,
                })
            );
            this.setState({
                addDialogOpen: false,
                safeProgress: 0,
                title: "",
                imgUrl: "",
                content: ""
            })
        } else {
            alert("Bitte alle Felder ausfüllen!")
        }
    };

    handleDelet = async (a) => {
        Fire.db.ref('data/' + a.key).remove()
    };

    fileSelect = (e) => {
        this.setState({
            imgObjekt: e.target.files[0]
        })
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
                                </ExpansionPanelDetails>
                                <div className={'EditButtonContainer'}>
                                    <Button style={{margin: 5, background: 'green', color: 'white'}} onClick={() => this.handleEdit(a)} variant="fab" aria-label="Delete">
                                        <CreateIcon />
                                    </Button>
                                    <Button style={{margin: 5}} onClick={() => this.handleDelet(a)} variant="fab" color="secondary" aria-label="Edit">
                                        <DeleteIcon />
                                    </Button>
                                </div>
                            </ExpansionPanel>
                        )
                    })): (<div className={'AppSpinnerContainer'}><CircularProgress/></div>)}
                </div>
                {/*
                    Edit Dialog
                */}
                <Dialog
                    fullScreen={this.props.fullScreen}
                    open={this.state.editDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Blogpost bearbeiten"}</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                className={'TextField'}
                                label="Titel"
                                value={this.state.title}
                                onChange={this.handleChange('title')}
                                margin="normal"
                            />
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
                        <Button onClick={() => this.setState({addDialogOpen: false})} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={this.handleEditSubmit} color="primary" autoFocus>
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
                {/*
                    Add Dialog
                */}
                <div className={'AddButtonContainer'}>
                    <Button onClick={() => this.setState({addDialogOpen: true})} variant="fab" color="primary" aria-label="Add" className={'AddButton'}>
                        <AddIcon />
                    </Button>
                </div>
                <Dialog
                    fullScreen={this.props.fullScreen}
                    open={this.state.addDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Blogpost erstellen"}</DialogTitle>
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
                        <Button onClick={() => this.setState({addDialogOpen: false})} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={this.handleAddSubmit} color="primary" autoFocus>
                            Speichern
                        </Button>
                        <CircularProgress style={{opacity: this.state.safeProgress}}/>
                    </DialogActions>
                </Dialog>
            </div>

        )
    };
}

export default withMobileDialog()(Privet);