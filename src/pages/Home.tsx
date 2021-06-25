import { useHistory } from 'react-router';
import { FiLogIn } from 'react-icons/fi';

import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoGoogleImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exist");
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed!');
      return;
    }

    history.push(`rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
        <strong>Crie salas de Q&A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência ao vivo</p>
      </aside>
      <main>
        <div className="main-content">

          <img src={logoImg} alt="Letmeask" />

          <button className="create-room" onClick={handleCreateRoom}>
            <img src={logoGoogleImg} alt="Logo do Google" />
            Crie sua sala com Google
          </button>
          <div className="separator">
            Ou entre em uma sala
          </div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              <FiLogIn style={{ fontSize: '1.2rem', marginRight: '1rem' }} />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}