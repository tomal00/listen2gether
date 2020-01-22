import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class MobileMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tab: 0 };
        this.handleSwitch = this.handleSwitch.bind(this);
    }
    handleSwitch(e, val) {
        this.setState({ tab: val });
    }
    render() {
        const possibleTabs = React.Children.toArray(this.props.children);
        const { disableRoomTabs } = this.props;

        return (
            <React.Fragment>
                <AppBar position='static' color='secondary'>
                    <Tabs value={this.state.tab}
                        indicatorColor={'primary'}
                        onChange={this.handleSwitch}
                        fullWidth >
                        <Tab
                            value={0}
                            label='Lobby' />
                        <Tab
                            value={1}
                            label='Player'
                            disabled={disableRoomTabs} />
                        <Tab
                            value={2}
                            label='Users'
                            disabled={disableRoomTabs} />
                        <Tab
                            value={3}
                            label='Chat'
                            disabled={disableRoomTabs} />
                        <Tab
                            value={4}
                            label='Room'
                            disabled={disableRoomTabs} />
                    </Tabs>
                </AppBar>
                {disableRoomTabs ? possibleTabs[0] : possibleTabs[this.state.tab]}
            </React.Fragment>
        );
    }
}

export default MobileMenu;
