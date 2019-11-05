import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Result,
  Row
} from 'antd';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { useStore } from '../../store';
import useAuth from '../../hooks/useAuth';

const FormItem = Form.Item;

const RegisterForm = ({
  history, location, form
}) => {
  const initialValidation = { status: '', help: '' };
  const [validation, setValidation] = useState(initialValidation);
  const { signUp } = useAuth();
  const [{ auth }] = useStore();
  const { getFieldDecorator, validateFields } = form;
  const user = _.get(auth, 'user._id');
  useEffect(
    () => {
      setValidation(initialValidation);
    },
    [location.pathname, user]
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    let val = { status: 'validating', help: 'Please wait...' };
    validateFields(async (err, values) => {
      if (!err) {
        setValidation(val);
        const result = await signUp(values);
        const { err: error, errMsg } = result;
        if (error) {
          val = { status: 'error', help: errMsg };
          setValidation(val);
        }
      }
    });
  };

  const SingUpResult = () => (
    <Result
      status="success"
      title="You have signed up successfully!"
      subTitle="Please proceed to the login page."
      extra={[
        <Button type="primary" key="signup" onClick={() => history.push('/signin')}>
          Sign in
        </Button>
      ]}
    />);
  const grid = {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 16 },
    lg: { span: 12 },
  };
  return (
    <div>
      {
        !user ?
          <Row type="flex" justify="center" align="middle" style={{ margin: '10%' }}>
            <Col {...grid}>
              <Card title="Sign up">
                <Form onSubmit={handleSubmit}>
                  <FormItem>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Please input your user name!' }],
                    })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('email', {
                      rules: [{ required: true, message: 'Please input your Email!' }],
                    })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your password!' }],
                    })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)}
                  </FormItem>
                  <FormItem
                    validateStatus={validation.status}
                    help={validation.help}
                  >
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Continue</Button>
                  </FormItem>
                </Form>
              </Card>
            </Col>
          </Row> :
          <SingUpResult />
      }
    </div>


  );
};
RegisterForm.propTypes = {
  form: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

const WrappedRegisterForm = Form.create()(RegisterForm);
export default withRouter(WrappedRegisterForm);
