'use client';

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const COLS = 14;
const ROWS = 16;
const INITIAL_LENGTH = 3;

type Dir = 'up' | 'down' | 'left' | 'right';
type Point = Readonly<{ x: number; y: number }>;
type GameSlice = Readonly<{ snake: Point[]; dir: Dir; food: Point }>;

function opposite(dir: Dir): Dir {
    switch (dir) {
        case 'up': return 'down';
        case 'down': return 'up';
        case 'left': return 'right';
        default: return 'left';
    }
}

function keyToDir(key: string): Dir | null {
    if (key === 'ArrowUp') return 'up';
    if (key === 'ArrowDown') return 'down';
    if (key === 'ArrowLeft') return 'left';
    if (key === 'ArrowRight') return 'right';
    return null;
}

function randomFood(occupied: ReadonlySet<string>): Point {
    for (let n = 0; n < 5000; n += 1) {
        const x = Math.floor(Math.random() * COLS);
        const y = Math.floor(Math.random() * ROWS);
        if (!occupied.has(`${x},${y}`)) return { x, y };
    }
    return { x: 0, y: 0 };
}

function buildInitialSnake(): Point[] {
    const midY = Math.floor(ROWS / 2);
    const midX = Math.floor(COLS / 2);
    const body: Point[] = [];
    for (let i = 0; i < INITIAL_LENGTH; i += 1) {
        body.push({ x: midX - i, y: midY });
    }
    return body;
}

function createInitialSlice(): GameSlice {
    const snake = buildInitialSnake();
    const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
    return { snake, dir: 'right', food: randomFood(occupied) };
}

function stepGameSlice(
    prev: GameSlice,
    queued: Dir | null,
): GameSlice | { readonly type: 'gameOver'; slice: GameSlice } {
    let nextDir = prev.dir;
    if (queued !== null && queued !== opposite(prev.dir)) nextDir = queued;

    const head = prev.snake[0];
    let nx = head.x;
    let ny = head.y;

    switch (nextDir) {
        case 'up': ny -= 1; break;
        case 'down': ny += 1; break;
        case 'left': nx -= 1; break;
        default: nx += 1;
    }

    const willEat = prev.food.x === nx && prev.food.y === ny;
    const bodyForCollision = willEat ? prev.snake : prev.snake.slice(0, -1);

    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || bodyForCollision.some((p) => p.x === nx && p.y === ny)) {
        return { type: 'gameOver', slice: { ...prev, dir: nextDir } };
    }

    const newHead: Point = { x: nx, y: ny };
    const nextSnake = willEat
        ? [newHead, ...prev.snake]
        : [newHead, ...prev.snake.slice(0, -1)];

    let nextFood = prev.food;
    if (willEat) {
        const occupied = new Set(nextSnake.map((p) => `${p.x},${p.y}`));
        nextFood = randomFood(occupied);
    }

    return { snake: nextSnake, dir: nextDir, food: nextFood };
}

export type PortfolioSnakeDialogProps = {
    readonly reducedMotion: boolean;
    readonly triggerClassName?: string;
};

type GameModel = Readonly<{ slice: GameSlice; gameOver: boolean }>;

function createInitialModel(): GameModel {
    return { slice: createInitialSlice(), gameOver: false };
}

export function PortfolioSnakeDialog({ reducedMotion, triggerClassName }: PortfolioSnakeDialogProps): ReactElement {
    const [open, setOpen] = useState(false);
    const [model, setModel] = useState<GameModel>(() => createInitialModel());
    const queuedDir = useRef<Dir | null>(null);
    const tickMs = reducedMotion ? 340 : 125;

    const reset = useCallback((): void => {
        queuedDir.current = null;
        setModel(createInitialModel());
    }, []);

    const handleOpenChange = useCallback((next: boolean): void => {
        setOpen(next);
        queuedDir.current = null;
        if (next) setModel(createInitialModel());
    }, []);

    useEffect(() => {
        if (!open || model.gameOver) return undefined;

        const id = window.setInterval(() => {
            const turn = queuedDir.current;
            queuedDir.current = null;

            setModel((prev) => {
                if (prev.gameOver) return prev;
                const nextSlice = stepGameSlice(prev.slice, turn);
                if ('type' in nextSlice) return { slice: nextSlice.slice, gameOver: true };
                return { slice: nextSlice, gameOver: false };
            });
        }, tickMs);

        return () => window.clearInterval(id);
    }, [model.gameOver, open, tickMs]);

    useEffect(() => {
        if (!open || model.gameOver) return undefined;

        const onKey = (event: KeyboardEvent): void => {
            const candidate = keyToDir(event.key);
            if (candidate === null) return;
            event.preventDefault();
            queuedDir.current = candidate;
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [model.gameOver, open]);

    const score = Math.max(0, model.slice.snake.length - INITIAL_LENGTH);
    const { slice, gameOver } = model;

    const enqueueDirection = (dir: Dir): void => {
        if (!open || gameOver) return;
        queuedDir.current = dir;
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
                type="button"
                className={cn(
                    'rounded-md border border-transparent px-1 py-0.5 text-sm text-muted-foreground underline decoration-primary/70 underline-offset-8 hover:text-foreground hover:underline focus-visible:border focus-visible:border-ring focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none dark:focus-visible:border-ring dark:focus-visible:bg-background',
                    triggerClassName,
                )}
            >
                Retro break
            </DialogTrigger>

            <DialogContent aria-describedby="snake-game-description" className="gap-6 sm:max-w-md">
                <DialogHeader className="text-left">
                    <DialogTitle>Nano Snake</DialogTitle>
                    <DialogDescription id="snake-game-description">
                        Score grows each time you snack. On desktop, use arrow keys; on phones and tablets, use the direction buttons under the grid.
                        {reducedMotion ? <span className="mt-1 block">Reduced motion: the snake moves more slowly here.</span> : null}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-muted-foreground text-sm">
                            Score: <span className="font-semibold text-foreground">{score}</span>
                        </p>
                        <Button type="button" variant="outline" size="sm" onClick={() => reset()}>
                            Restart
                        </Button>
                    </div>

                    <div
                        role="application"
                        aria-label="Nano Snake game board"
                        className={cn('border-border/80 bg-muted/40 grid max-w-full rounded-lg border p-3 dark:bg-muted/20 gap-px')}
                        style={{
                            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
                        }}
                    >
                        {Array.from({ length: ROWS * COLS }, (_, i) => {
                            const x = i % COLS;
                            const y = Math.floor(i / COLS);
                            const isHead = slice.snake[0]?.x === x && slice.snake[0]?.y === y;
                            const segmentIndex = slice.snake.findIndex((p) => p.x === x && p.y === y);
                            const isBody = segmentIndex > 0;
                            const isFood = slice.food.x === x && slice.food.y === y;

                            return (
                                <div
                                    key={`cell-${String(x)}-${String(y)}`}
                                    className={cn(
                                        'aspect-square rounded-[2px] bg-background/85',
                                        isHead && 'rounded-sm bg-primary shadow-primary ring-2 ring-primary ring-offset-1 ring-offset-background',
                                        isBody && !isHead && 'bg-primary/85',
                                        isFood && !isHead && 'bg-accent shadow-inner',
                                        gameOver && (isHead || isBody) && 'opacity-80',
                                    )}
                                />
                            );
                        })}
                    </div>

                    <div aria-label="Direction controls" className="touch-manipulation mx-auto grid w-[11.5rem] select-none grid-cols-3 gap-1 sm:w-[13rem]">
                        <div />
                        <Button type="button" variant="outline" size="icon" aria-label="Move up" disabled={gameOver} className="size-12 sm:size-11" onClick={() => enqueueDirection('up')}>
                            <ChevronUp className="size-5" aria-hidden />
                        </Button>
                        <div />
                        <Button type="button" variant="outline" size="icon" aria-label="Move left" disabled={gameOver} className="size-12 sm:size-11" onClick={() => enqueueDirection('left')}>
                            <ChevronLeft className="size-5" aria-hidden />
                        </Button>
                        <span aria-hidden className="text-muted-foreground flex items-center justify-center text-[0.6875rem] font-medium tracking-wide uppercase">D-pad</span>
                        <Button type="button" variant="outline" size="icon" aria-label="Move right" disabled={gameOver} className="size-12 sm:size-11" onClick={() => enqueueDirection('right')}>
                            <ChevronRight className="size-5" aria-hidden />
                        </Button>
                        <div />
                        <Button type="button" variant="outline" size="icon" aria-label="Move down" disabled={gameOver} className="size-12 sm:size-11" onClick={() => enqueueDirection('down')}>
                            <ChevronDown className="size-5" aria-hidden />
                        </Button>
                        <div />
                    </div>

                    {gameOver ? (
                        <p className="text-destructive text-center text-sm font-medium">Game over — hit Restart for another round.</p>
                    ) : (
                        <p className="text-muted-foreground text-center text-xs">Turns queue one per tick, so zig-zag carefully around your tail.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
