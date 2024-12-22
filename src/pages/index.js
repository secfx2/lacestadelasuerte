import { useState } from 'react'; // Necesario para manejar el estado
import { FaPaperPlane } from 'react-icons/fa'; // Icono del avión
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [phone, setPhone] = useState(''); // Estado para almacenar el número de teléfono
  const [popupMessage, setPopupMessage] = useState(''); // Mensaje del popup
  const [popupType, setPopupType] = useState('success'); // Tipo del popup: success o error
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar la visibilidad del popup
  const [fadeOut, setFadeOut] = useState(false); // Estado para controlar el fade-out

  // Función para manejar la entrada
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Permitir solo números y limitar a 9 caracteres
    if (/^\d*$/.test(value) && value.length <= 9) {
      setPhone(value);
    }
  };

  // Función para mostrar el popup
  const showPopupMessage = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);

    // Oculta el popup después de 5 segundos
    setTimeout(() => setFadeOut(true), 4500);
    setTimeout(() => {
      setShowPopup(false);
      setFadeOut(false);
    }, 5000);
  };

  // Función para enviar el número
  const handleSendNumber = async () => {
    if (phone.length === 9) {
      // Muestra el popup de éxito
      showPopupMessage('Hemos anotado tu número', 'success');

      // Guarda el número en el .json (simulado)
      await fetch('/api/save-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      // Limpia el input
      setPhone('');
    } else {
      // Muestra el popup de error
      showPopupMessage('Por favor, introduce un número válido de 9 dígitos.', 'error');
    }
  };

  return (
    <>
      <Head>
        <title>La Cesta de la Suerte</title>
        <meta name="description" content="Descubre las mejores cestas de navidad, reyes... ahora disponible." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/cestapng3.ico" />
      </Head>

      <div className="relative min-h-screen flex flex-col items-center bg-white overflow-hidden font-acumin">
        {/* Patrón de fondo */}
        <div
          className="absolute top-0 w-full h-[25%] bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/pattern.svg')", backgroundPosition: "bottom" }}
        ></div>

        {/* Logo central */}
        <div className="mt-[5%] z-10">
          <img
            src="/logo.svg"
            alt="La Cesta de la Suerte"
            className="w-[400px] sm:w-[500px] lg:w-[700px] h-auto"
          />
        </div>

        {/* Texto y formulario */}
        <div className="mt-10 text-center px-4 z-10">
          <p className="text-xl sm:text-2xl lg:text-4xl font-semibold text-cgold">
            ¿QUIERES QUE TE NOTIFIQUEMOS CUANDO TENGAMOS
          </p>
          <p className="text-3xl sm:text-4xl lg:text-6xl font-bold text-cgreen">
            NUESTRA PRIMERA CESTA?
          </p>

          {/* Input con botón */}
          <div className="mt-10 flex justify-center w-full px-4">
            <div className="flex w-full max-w-[700px]">
              {/* Input de texto */}
              <input
                type="text"
                value={phone}
                onChange={handleInputChange}
                placeholder="Introduce tu número de teléfono"
                className="appearance-none rounded-none flex-grow h-[60px] sm:h-[70px] lg:h-[80px] text-lg sm:text-xl lg:text-2xl px-4 bg-cgreen text-white placeholder-white text-center focus:outline-none"
                maxLength={9}
              />
              {/* Botón cuadrado dorado */}
              <button
                onClick={handleSendNumber}
                className="appearance-none rounded-none bg-cgold w-[80px] h-[60px] sm:w-[80px] sm:h-[70px] lg:w-[80px] lg:h-[80px] flex items-center justify-center hover:bg-opacity-90 transition"
              >
                <FaPaperPlane className="text-white text-xl sm:text-2xl lg:text-3xl" />
              </button>
            </div>
          </div>

          {/* Popup */}
          {showPopup && (
            <div
              className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-lg font-acumin shadow-md transition-opacity duration-500 ${
                fadeOut ? 'opacity-0' : 'opacity-100'
              } ${popupType === 'success' ? 'bg-cgreen text-white' : 'bg-red-500 text-white'}`}
            >
              {popupMessage}
            </div>
          )}

          {/* Términos y condiciones */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-cgreen font-sans">
            Al introducir tu número de teléfono, aceptas nuestros{' '}
            <Link href="/terms" className="underline font-semibold text-cgreen">
              términos y condiciones
            </Link>.
          </p>
        </div>
      </div>
    </>
  );
}
