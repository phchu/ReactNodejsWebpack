import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row
} from 'antd';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { SIGN_IN } from '../../graphql/user';

const FormItem = Form.Item;

const LoginForm = ({
  history, location, form, refetch
}) => {
  const initialValidation = { status: '', help: '' };
  const [validation, setValidation] = useState(initialValidation);
  const { getFieldDecorator, validateFields } = form;
  useEffect(
    () => {
      setValidation(initialValidation);
    },
    [location.pathname]
  );
  const handleSubmit = (e, signin, apiErr) => {
    e.preventDefault();
    const val = { status: 'validating', help: 'Please wait...' };
    validateFields(async (err, input) => {
      if (!err && !apiErr) {
        setValidation(val);
        signin({ variables: { input } }).then(async ({ data }) => {
          localStorage.setItem('token', data.signin.token);
          await refetch();
          history.push('/');
        });
      }
    });
  };
  const grid = {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 16 },
    lg: { span: 12 },
  };
  return (
    <Mutation mutation={SIGN_IN}>
      {(signin, { loading, error }) => (
        <Row type="flex" justify="center" align="middle" style={{ margin: '10%' }}>
          <Col {...grid}>
            <Card title="Sign In">
              <Form onSubmit={e => handleSubmit(e, signin, error)}>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your Email!', type: 'email' }],
                  })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />)}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your password!', len: 6 }],
                  })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)}
                </FormItem>
                <FormItem
                  validateStatus={validation.status}
                  help={validation.help}
                >
                  <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>Sign In</Button>
                  No account?<a href="/signup" style={{ marginLeft: '5px' }}>Sign up now!</a>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </Mutation>
  );
};
LoginForm.propTypes = {
  form: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired
};

const WrappedLoginForm = Form.create()(LoginForm);
export default withRouter(WrappedLoginForm);
