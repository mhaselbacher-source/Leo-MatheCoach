import type { PendingSessionSync, SessionTask } from "../../state/app-types";

type RemoteQuizType = "times" | "frac";

export interface RemoteSessionResultItem {
  type: RemoteQuizType;
  correct: boolean;
  close: boolean;
  time: number;
  factKey?: string;
}

function getRemoteQuizType(moduleId: PendingSessionSync["moduleId"]): RemoteQuizType {
  return moduleId === "times" ? "times" : "frac";
}

function getTaskById(tasks: SessionTask[], taskId: string) {
  return tasks.find((task) => task.id === taskId) ?? null;
}

export function mapPendingSessionSyncToRpcResults(
  pendingSessionSync: PendingSessionSync,
): RemoteSessionResultItem[] {
  const quizType = getRemoteQuizType(pendingSessionSync.moduleId);

  return pendingSessionSync.answers.map((answer) => {
    const task = getTaskById(pendingSessionSync.tasks, answer.taskId);
    const isCloseFractionAnswer =
      pendingSessionSync.moduleId === "frac" &&
      !answer.isCorrect &&
      task?.kind === "choice" &&
      answer.value.trim().length > 0;

    return {
      type: quizType,
      correct: answer.isCorrect,
      close: isCloseFractionAnswer,
      time: 0,
      factKey:
        pendingSessionSync.moduleId === "times" && task?.kind === "number"
          ? task.factKey
          : undefined,
    };
  });
}
