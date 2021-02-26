import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FirebaseError } from '../../firebase/client';
import { signIn } from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';
import styles from './SignIn.module.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.auth.loading);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    if (!email) return setError("Email can't be empty");
    if (!password) return setError("Password can't be empty");
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    const onSuccess = () => history.push('/');
    const onFailure = (err: FirebaseError) => {
      if (err.code === 'auth/too-many-requests') {
        return setError(
          'Too many failed attempts. Try again later, or reset your password'
        );
      }
      if (err.code === 'auth/user-not-found') {
        return setError('User does not exist!');
      }
      setError('Incorrect email or password');
    };

    dispatch(signIn(email, password, onSuccess, onFailure));
  };

  return (
    <div className={styles.signIn + ' container'}>
      <h1 className={styles.heading}>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputs}>
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

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button disabled={loading} className={styles.btn + ' btn btn-primary'}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
