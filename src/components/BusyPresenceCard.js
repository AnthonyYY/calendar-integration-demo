import React, { Component } from 'react';
import { Row, Col, Card, Timeline } from 'antd';

const CalendarCard = ({title, schedule, type}) => {
     return (
        schedule.length
        ? <Card title={`${title} Schedule`} extra={type} hoverable>
            <Timeline>
                {schedule.map((item, index) => (
                    <Timeline.Item color={type === 'BUSY TIME' ? 'red' : 'blue'} key={index}>{item.start} - {item.end}</Timeline.Item>
                ))}
            </Timeline>
        </Card>
        : ''
    )
}

class BusyPresenceCard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {googleCalendar, office365Calendar} = this.props.calendar;
        let bothCalendarEnabled = googleCalendar.length && office365Calendar.length;
        let layout = {span: bothCalendarEnabled ? 12 : 24}
        return (
            <Row>
                <Col {...layout}>
                    <CalendarCard title={"Google Calendar"} schedule={googleCalendar} type="BUSY TIME"></CalendarCard>
                </Col>
                <Col {...layout}>
                    <CalendarCard title={"office365 Calendar"} schedule={office365Calendar} type="FREE TIME"></CalendarCard>
                </Col>
            </Row>
        )
    }
}

export default BusyPresenceCard;