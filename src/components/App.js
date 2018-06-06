import React, { Component } from 'react';
import { Button } from 'antd';
import BindingCard from './BindingCard';
import BusyPresenceCard from './BusyPresenceCard';
import { Row, Col } from 'antd';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            googleCalendar: [],
            office365Calendar: []
        }
        this.loadGoogleCalendar = this.loadGoogleCalendar.bind(this);
        this.loadOffice365Calendar = this.loadOffice365Calendar.bind(this);
    }

    loadGoogleCalendar() {
        fetch('/google/getcalender').then(res => res.json()).then(res => {
            this.setState({
                googleCalendar: res.result
            });
        });
    }

    loadOffice365Calendar() {
        fetch('/office365/getcalender').then(res => res.json()).then(res => {
            this.setState({
                office365Calendar: res.result
            });
        });
    }

    render() {
        return (
            <div style={{paddingTop: 50, marginLeft: 200, marginRight: 200}}>
                <Row>
                    <Col>
                        <BindingCard 
                        onOfficeBinding={this.loadOffice365Calendar}
                        onGoogleBinding={this.loadGoogleCalendar}/>
                    </Col>
                </Row>
                <BusyPresenceCard calendar={{...this.state}}/>
            </div>
        )
    }
}