import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { createNote } from '../../api/notes.api';
import { transcribeAudio } from '../../services/speechToText.service';

export function CreateNotePage() {
    const { bookId } = useParams();

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const [transcription, setTranscription] = useState('');
    const [correctedText, setCorrectedText] = useState('');

    const [isTranscribing, setIsTranscribing] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (!isRecording) {
            return;
        }

        const interval = window.setInterval(() => {
            setRecordingTime((time) => time + 1);
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(() => {
        return () => {
            mediaStreamRef.current?.getTracks().forEach((track) => {
                track.stop();
            });

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            setError(null);
            setSaveError(null);
            setSaved(false);

            setTranscription('');
            setCorrectedText('');
            setAudioBlob(null);

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            mediaStreamRef.current = stream;
            audioChunksRef.current = [];

            const mimeType = MediaRecorder.isTypeSupported(
                'audio/webm;codecs=opus',
            )
                ? 'audio/webm;codecs=opus'
                : '';

            const recorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {
                    type: recorder.mimeType,
                });

                setAudioBlob(blob);

                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                stream.getTracks().forEach((track) => {
                    track.stop();
                });

                mediaStreamRef.current = null;
            };

            mediaRecorderRef.current = recorder;

            recorder.start();

            setRecordingTime(0);
            setIsRecording(true);
        } catch {
            setError(
                'No pudimos acceder al micrófono. Revisa los permisos del navegador.',
            );
        }
    };

    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;

        if (!recorder || recorder.state === 'inactive') {
            return;
        }

        recorder.stop();
        setIsRecording(false);
    };

    const handleTranscribe = async () => {
        if (!audioBlob) {
            setError('No hay una grabación para transcribir.');
            return;
        }

        setIsTranscribing(true);
        setError(null);
        setSaveError(null);

        try {
            const text = await transcribeAudio(audioBlob);

            setTranscription(text);

            // Inicialmente mostramos la transcripción
            // como texto editable.
            setCorrectedText(text);
        } catch {
            setError('No se pudo transcribir la grabación.');
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleSaveNote = async () => {
        if (!bookId) {
            setSaveError('No se encontró el libro.');
            return;
        }

        if (!transcription || !correctedText.trim()) {
            setSaveError(
                'Debes tener una transcripción para guardar la nota.',
            );
            return;
        }

        setSaving(true);
        setSaveError(null);
        setSaved(false);

        try {
            await createNote({
                bookId: Number(bookId),
                transcriptionText: transcription,
                correctedText: correctedText.trim(),
            });

            setSaved(true);
        } catch {
            setSaveError('No se pudo guardar la nota.');
        } finally {
            setSaving(false);
        }
    };

    const handleRecordAgain = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(null);
        setAudioBlob(null);

        setTranscription('');
        setCorrectedText('');

        setRecordingTime(0);

        setError(null);
        setSaveError(null);
        setSaved(false);
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <Link
                    to={`/books/${bookId}`}
                    className="btn btn-link px-0 text-decoration-none"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al libro
                </Link>
            </div>

            <div className="mb-4">
                <h2 className="h4 fw-semibold mb-1">
                    Nueva nota
                </h2>

                <p className="text-secondary mb-0">
                    Graba tus ideas y conviértelas en texto.
                </p>
            </div>

            <section className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">

                    {/* Estado inicial */}
                    {!isRecording && !audioUrl && (
                        <>
                            <div className="fs-1 mb-3">
                                🎙️
                            </div>

                            <h3 className="h5 fw-semibold">
                                ¿Lista para hablar?
                            </h3>

                            <p className="text-secondary">
                                Cuando estés lista, comenzaremos a grabar tu
                                nota.
                            </p>

                            <button
                                type="button"
                                className="btn btn-dark px-4 py-3 mt-2"
                                onClick={startRecording}
                            >
                                <i className="bi bi-mic-fill me-2"></i>
                                Comenzar grabación
                            </button>
                        </>
                    )}

                    {/* Grabando */}
                    {isRecording && (
                        <>
                            <div className="fs-1 mb-3">
                                🔴
                            </div>

                            <h3 className="h5 fw-semibold">
                                Grabando...
                            </h3>

                            <p className="fs-3 fw-semibold mb-4">
                                {formatTime(recordingTime)}
                            </p>

                            <button
                                type="button"
                                className="btn btn-danger px-4 py-3"
                                onClick={stopRecording}
                            >
                                <i className="bi bi-stop-fill me-2"></i>
                                Detener grabación
                            </button>
                        </>
                    )}

                    {/* Grabación terminada */}
                    {!isRecording && audioUrl && (
                        <>
                            <div className="fs-1 mb-3">
                                ✅
                            </div>

                            <h3 className="h5 fw-semibold mb-3">
                                Grabación lista
                            </h3>

                            <audio
                                controls
                                src={audioUrl}
                                className="w-100 mb-4"
                            />

                            {/* Transcribir */}
                            {!transcription && (
                                <button
                                    type="button"
                                    className="btn btn-dark py-3 w-100"
                                    onClick={handleTranscribe}
                                    disabled={isTranscribing}
                                >
                                    <i className="bi bi-magic me-2"></i>

                                    {isTranscribing
                                        ? 'Transcribiendo...'
                                        : 'Transcribir grabación'}
                                </button>
                            )}

                            {/* Transcripción y edición */}
                            {transcription && (
                                <div className="text-start mt-4">
                                    <label
                                        htmlFor="correctedText"
                                        className="form-label fw-semibold"
                                    >
                                        Corrige tu nota
                                    </label>

                                    <textarea
                                        id="correctedText"
                                        className="form-control"
                                        rows={8}
                                        value={correctedText}
                                        onChange={(event) =>
                                            setCorrectedText(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Corrige aquí la transcripción..."
                                    />

                                    <small className="text-secondary">
                                        Puedes modificar el texto antes de
                                        guardar la nota.
                                    </small>

                                    <button
                                        type="button"
                                        className="btn btn-dark w-100 mt-3"
                                        onClick={handleSaveNote}
                                        disabled={
                                            saving ||
                                            !correctedText.trim()
                                        }
                                    >
                                        <i className="bi bi-check-lg me-2"></i>

                                        {saving
                                            ? 'Guardando...'
                                            : 'Guardar nota'}
                                    </button>
                                </div>
                            )}

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100 mt-3"
                                onClick={handleRecordAgain}
                                disabled={saving || isTranscribing}
                            >
                                <i className="bi bi-arrow-repeat me-2"></i>
                                Grabar nuevamente
                            </button>

                            {saveError && (
                                <div className="alert alert-danger mt-3 mb-0">
                                    {saveError}
                                </div>
                            )}

                            {saved && (
                                <div className="alert alert-success mt-3 mb-0">
                                    Nota guardada correctamente.
                                </div>
                            )}
                        </>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-danger mt-4 mb-0">
                            {error}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}