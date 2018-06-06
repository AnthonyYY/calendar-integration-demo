import React, { Component } from 'react';
import { 
    Card,
    Form,
    Switch
} from 'antd';

const formItemLayout = {
    colon: false,
    labelCol: {
      span: 4
    },
    wrapCol: {
      span: 10
    },
}

const activeTarget = [
    'GOOGLE_CALENDAR',
    'OFFICE_365'
]

class BindingCard extends Component {
    constructor(props) {
        super(props);
        this.authorizationWindow = null;
        this.state = {
            googleCalendar: {
                enabled: false,
                authorizationUrl: null,
                loading: false
            },
            office365: {
                enabled: false,
                authorizationUrl: null,
                loading: false
            },
        }
        this._loadGoogleAuthorizationUrl = this._loadGoogleAuthorizationUrl.bind(this);
        this._loadOfficeAuthorizationUrl = this._loadOfficeAuthorizationUrl.bind(this);
    }
    componentDidMount(){
        window.addEventListener('message', (data) => {            
            if(data.data.msg === 'close') {
                this.authorizationWindow && this.authorizationWindow.close();
                let isGoogle = data.data.from === activeTarget[0];
                let key = isGoogle ? 'googleCalendar' : 'office365'
                isGoogle ? this.props.onGoogleBinding() : this.props.onOfficeBinding();
                this.setState({
                    [key]: {
                        enabled: true,
                        loading: false
                    }
                });
            }
        })
        this._loadGoogleAuthorizationUrl();
        this._loadOfficeAuthorizationUrl();
    }

    _loadGoogleAuthorizationUrl() {
        fetch('/google/getssourl').then(res => res.json()).then(res => {
            if(res.code === 0) {
                const { islogin: enabled, url: authorizationUrl } = res.result;
                if(enabled) {
                    this.props.onGoogleBinding();
                }
                this.setState({
                    googleCalendar: {
                        enabled,
                        authorizationUrl
                    }
                });
            } else {
                alert('network error')
            }
        });
    }

    _loadOfficeAuthorizationUrl() {
        fetch('/office365/getssourl').then(res => res.json()).then(res => {
            if(res.code === 0) {
                const { islogin: enabled, url: authorizationUrl } = res.result;
                if( enabled ) {
                    this.props.onOfficeBinding();
                }
                this.setState({
                    office365: {
                        enabled,
                        authorizationUrl
                    }
                });
            } else {
                alert('network error')
            }
        });
    }

    _openChildWindow(url, name, options='width=600, height=480, left=500') {
        this.authorizationWindow = window.open(url, name, options);
        console.log(this.authorizationWindow);
    }

    _unbindAccount(accountType) {
        let isGoogleAccount = accountType === activeTarget[0];
        let unbindUrl = isGoogleAccount ? '/google/clear' : '/office365/clear';
        let accountInState = isGoogleAccount ? 'googleCalendar' : 'office365';
        let onEnabled = isGoogleAccount ? this.props.onGoogleBinding : this.props.onOfficeBinding;
        let authorizationUrlInitFn = isGoogleAccount ? this._loadGoogleAuthorizationUrl : this._loadOfficeAuthorizationUrl;
        
        this.setState({
            [accountInState]: {
                loading: true
            }
        })
        fetch(unbindUrl).then( res => res.json() ).then( res => {
            if(res.code === 0) {
                this.setState({
                    [accountInState]: {
                        enabled: false,
                        loading: false
                    }
                });
                onEnabled([]);
                authorizationUrlInitFn();
            }else{
                console.error('error', err);
            }
        } );
    }

    authorizeGoogleAccount(event) {
        event 
        ? this._openChildWindow(this.state.googleCalendar.authorizationUrl, activeTarget[0])
        : this._unbindAccount(activeTarget[0]);
    }

    authorizeOffice365Account(event) {
        event 
        ? this._openChildWindow(this.state.office365.authorizationUrl, activeTarget[1])
        : this._unbindAccount(activeTarget[1]);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <Card hoverable title={"3rd party Account Binding"}>
              <Form>
                <Form.Item {...formItemLayout} label={"Google Calendar"}>
                  {getFieldDecorator('google')(
                    <Switch
                    onChange={ this.authorizeGoogleAccount.bind(this) }
                    checked={this.state.googleCalendar.enabled}/>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={"Office 365"} style={{marginBottom: 0}}>
                  {getFieldDecorator('office')(
                    <Switch
                    onChange={ this.authorizeOffice365Account.bind(this) }
                    checked={this.state.office365.enabled}/>
                  )}
                </Form.Item>
              </Form>
            </Card>
        )
    }
}

export default Form.create()(BindingCard);