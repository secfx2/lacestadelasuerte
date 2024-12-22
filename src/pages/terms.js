import { useRouter } from 'next/router';

export default function Terms() {
  const router = useRouter(); // Para manejar la navegación

  const handleGoBack = () => {
    router.push('/'); // Volver a la página principal (index)
  };

  return (
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

      {/* Texto de términos */}
      <div className="mt-10 text-center px-8 z-10 max-w-[1000px]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cgold">
          Términos y Condiciones
        </h1>
        <p className="mt-8 text-lg sm:text-xl lg:text-xl text-cgreen leading-relaxed">
          Al introducir su número de teléfono en esta página, usted otorga su
          consentimiento expreso para recibir contenido promocional relacionado
          con el lanzamiento de nuestra cesta de Navidad. Este contenido será
          enviado exclusivamente una vez que la cesta esté disponible para la
          venta. Nos comprometemos a utilizar su información únicamente para
          este propósito.
        </p>
        <p className="mt-8 text-sm sm:text-xl lg:text-lg text-cgreen leading-relaxed">
          Usted puede ejercer su derecho a desuscribirse en cualquier momento
          enviándonos un mensaje al correo electrónico{' '}
          <a href="mailto:contacto@tuempresa.com" className="text-cgold font-bold underline">
            contacto@tuempresa.com
          </a>{' '}
          o escribiéndonos al número de teléfono{' '}
          <span className="text-cgreen font-bold">+34 600 123 456</span>. Una
          vez recibida su solicitud, eliminaremos su número de nuestra base de
          datos de forma inmediata.
        </p>
        <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-cgold leading-relaxed">
          Para más información, puede ponerse en contacto con nosotros a través
          de los medios anteriormente indicados.
        </p>
      </div>

      {/* Botón Volver */}
      <div className="mt-10">
        <button
          onClick={handleGoBack}
          className="bg-cgreen py-6 px-24 text-white text-lg sm:text-xl lg:text-2xl rounded-none flex items-center justify-center hover:bg-opacity-90 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
