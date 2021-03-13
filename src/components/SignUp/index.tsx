import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FirebaseError } from '../../firebase/client';
import { signUp } from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';
import styles from './SignUp.module.scss';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.auth.loading);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    if (!username) return setError("Username can't be empty");
    if (!email) return setError("Email can't be empty");
    if (!password) return setError("Password can't be empty");
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (!confirmPassword) return setError('Please confirm password');
    if (password !== confirmPassword) return setError('Passwords must match');

    const onSuccess = () => history.push('/');
    const onFailure = (err: FirebaseError) => setError(err.message);

    dispatch(signUp(username, email, password, onSuccess, onFailure));
  };

  return (
    <div className={styles.signUp + ' container'}>
      <h1 className={styles.heading}>Sign Up</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <label className={styles.label}>
            Display Name:
            <input
              className={styles.input}
              type='text'
              name='name'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Email:
            <input
              className={styles.input}
              type='text'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Password:
            <input
              className={styles.input}
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Confirm Password:
            <input
              className={styles.input}
              type='password'
              name='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button disabled={loading} className={styles.btn + ' btn btn-primary'}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
