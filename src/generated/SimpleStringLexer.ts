// Generated from src/Expr.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class SimpleStringLexer extends antlr.Lexer {
    public static readonly LETTERS = 1;
    public static readonly NEWLINE = 2;
    public static readonly WS = 3;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
    ];

    public static readonly symbolicNames = [
        null, "LETTERS", "NEWLINE", "WS"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "LETTERS", "NEWLINE", "WS",
    ];


    public constructor(input: antlr.CharStream) {
        super(input);
        this.interpreter = new antlr.LexerATNSimulator(this, SimpleStringLexer._ATN, SimpleStringLexer.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public get grammarFileName(): string { return "Expr.g4"; }

    public get literalNames(): (string | null)[] { return SimpleStringLexer.literalNames; }
    public get symbolicNames(): (string | null)[] { return SimpleStringLexer.symbolicNames; }
    public get ruleNames(): string[] { return SimpleStringLexer.ruleNames; }

    public get serializedATN(): number[] { return SimpleStringLexer._serializedATN; }

    public get channelNames(): string[] { return SimpleStringLexer.channelNames; }

    public get modeNames(): string[] { return SimpleStringLexer.modeNames; }

    public static readonly _serializedATN: number[] = [
        4,0,3,24,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,1,0,4,0,9,8,0,11,0,12,0,10,
        1,1,3,1,14,8,1,1,1,1,1,1,2,4,2,19,8,2,11,2,12,2,20,1,2,1,2,0,0,3,
        1,1,3,2,5,3,1,0,2,2,0,65,90,97,122,2,0,9,9,32,32,26,0,1,1,0,0,0,
        0,3,1,0,0,0,0,5,1,0,0,0,1,8,1,0,0,0,3,13,1,0,0,0,5,18,1,0,0,0,7,
        9,7,0,0,0,8,7,1,0,0,0,9,10,1,0,0,0,10,8,1,0,0,0,10,11,1,0,0,0,11,
        2,1,0,0,0,12,14,5,13,0,0,13,12,1,0,0,0,13,14,1,0,0,0,14,15,1,0,0,
        0,15,16,5,10,0,0,16,4,1,0,0,0,17,19,7,1,0,0,18,17,1,0,0,0,19,20,
        1,0,0,0,20,18,1,0,0,0,20,21,1,0,0,0,21,22,1,0,0,0,22,23,6,2,0,0,
        23,6,1,0,0,0,4,0,10,13,20,1,6,0,0
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!SimpleStringLexer.__ATN) {
            SimpleStringLexer.__ATN = new antlr.ATNDeserializer().deserialize(SimpleStringLexer._serializedATN);
        }

        return SimpleStringLexer.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(SimpleStringLexer.literalNames, SimpleStringLexer.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return SimpleStringLexer.vocabulary;
    }

    private static readonly decisionsToDFA = SimpleStringLexer._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}