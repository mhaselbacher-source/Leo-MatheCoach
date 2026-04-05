import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { evaluateTaskAnswer } from "../../modules/module-registry";
import { useAppDispatch, useAppState } from "../../state/app-context";
import styles from "./SessionScreen.module.css";

export function SessionScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const session = state.activeSession;
  const [textAnswer, setTextAnswer] = useState("");
  const [choiceAnswer, setChoiceAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    note?: string;
    feedbackNote?: string;
    submittedValue: string;
  } | null>(null);

  useEffect(() => {
    setTextAnswer("");
    setChoiceAnswer("");
    setFeedback(null);
  }, [session?.currentIndex]);

  if (!session) {
    return null;
  }

  const currentTask = session.tasks[session.currentIndex];
  const progressPercent = ((session.currentIndex + 1) / session.tasks.length) * 100;
  const currentValue =
    currentTask.kind === "number" ? textAnswer.trim() : choiceAnswer.trim();
  const readyToSubmit = Boolean(currentValue);

  const handlePrimaryAction = () => {
    if (feedback) {
      handleContinue();
      return;
    }

    if (!readyToSubmit) {
      return;
    }

    handleSubmit();
  };

  const handleSubmit = () => {
    const evaluation = evaluateTaskAnswer(session.moduleId, currentTask, currentValue);

    if (currentTask.kind === "number") {
      setTextAnswer(evaluation.submittedValue);
    } else {
      setChoiceAnswer(evaluation.submittedValue);
    }

    setFeedback({
      isCorrect: evaluation.isCorrect,
      correctAnswer: currentTask.answer,
      note: currentTask.helper,
      feedbackNote: currentTask.feedbackNote,
      submittedValue: evaluation.submittedValue,
    });
  };

  const handleContinue = () => {
    if (!feedback) {
      return;
    }

    dispatch({
      type: "submit_session_answer",
      payload: {
        value: feedback.submittedValue,
        isCorrect: feedback.isCorrect,
      },
    });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.topBar}>
        <Button variant="ghost" onClick={() => dispatch({ type: "go_home" })}>
          Zurück
        </Button>

        <div className={styles.titleBlock}>
          <p className={styles.moduleTitle}>{session.title}</p>
          <strong>
            {session.currentIndex + 1} von {session.tasks.length}
          </strong>
        </div>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <Card className={styles.taskCard} tone="accent">
        <p className={styles.taskSubtitle}>{session.subtitle}</p>
        {currentTask.label ? <p className={styles.taskSubtitle}>{currentTask.label}</p> : null}
        <h2 className={styles.taskPrompt}>{currentTask.prompt}</h2>

        {currentTask.kind === "number" ? (
          <input
            className={styles.answerInput}
            inputMode="numeric"
            value={textAnswer}
            onChange={(event) => setTextAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }

              event.preventDefault();
              handlePrimaryAction();
            }}
            placeholder="Antwort eingeben"
            autoFocus
            disabled={Boolean(feedback)}
          />
        ) : (
          <div className={styles.choiceGrid}>
            {currentTask.options.map((option) => (
              <button
                key={option}
                type="button"
                className={[
                  styles.choiceButton,
                  choiceAnswer === option ? styles.choiceButtonActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setChoiceAnswer(option)}
                disabled={Boolean(feedback)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <div className={styles.feedbackBar}>
          {feedback ? (
            <div className={styles.feedbackMessage}>
              <p
                className={[
                  styles.feedbackText,
                  feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {feedback.isCorrect
                  ? "Richtig. Weiter zur nächsten Aufgabe."
                  : `Noch nicht. Richtig ist ${feedback.correctAnswer}.`}
              </p>
              {!feedback.isCorrect && feedback.feedbackNote ? (
                <p className={styles.feedbackDetail}>{feedback.feedbackNote}</p>
              ) : null}
            </div>
          ) : (
            <p className={styles.feedbackHint}>
              {currentTask.helper ?? "Eine Aufgabe, dann direkt der nächste Schritt."}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            fullWidth
            onClick={handlePrimaryAction}
            disabled={!feedback && !readyToSubmit}
          >
            {feedback
              ? session.currentIndex === session.tasks.length - 1
                ? "Session abschließen"
                : "Weiter"
              : "Prüfen"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
