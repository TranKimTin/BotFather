import { ref, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, completeFromList, acceptCompletion } from "@codemirror/autocomplete";
import { keymap, EditorView } from '@codemirror/view';
import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

export default {
    name: "CodeMirror",
    components: {
        Codemirror,
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props: any, context: { emit: (event: 'update:modelValue', value: string) => void }) {
        const code = ref("");

        const completionList = [
            {
                label: 'myFunction1',
                type: 'variable',
                detail: 'Hàm số 1',
                info: 'Hàm thực hiện công việc XYZ',
                apply: 'myFunction1(1,2)',
                boost: 99,
                tag: tags.variableName,
            },
            {
                label: 'myFunction2',
                type: 'function',
                detail: 'Hàm số 2',
                info: 'Hàm thực hiện công việc ABC',
                apply: 'myFunction2()',
                boost: 98,
                tag: tags.keyword,
            },
        ];

        const customKeymap = keymap.of([
            {
                key: 'Tab', // Gán phím Tab
                run: (view) => {
                    if (acceptCompletion(view)) {
                        return true;
                    }
                    return false;
                },
                preventDefault: true,
            }
        ]);

        const customCompletionTheme = EditorView.theme({
            '&.cm-focused': {
                'outline': 'none'
            },
            '.cm-content': {
                'max-width': '100px'
            }
        });

        const customHighlightStyle = HighlightStyle.define([
            { tag: tags.keyword, color: '#007bff', fontWeight: 'bold' }, // Từ khóa
            { tag: tags.string, color: '#28a745', fontStyle: 'italic' }, // Chuỗi
            { tag: tags.variableName, color: '#6f42c1' },               // Tên biến
            { tag: tags.comment, color: '#6c757d', fontStyle: 'italic' }, // Chú thích
        ]);

        const extensions = [
            javascript(),
            customKeymap,
            customCompletionTheme,
            autocompletion({
                override: [completeFromList(completionList)],
            }),
            // customHighlightStyle
        ];

        const editorOptions = {
            theme: "default",
            lineNumbers: false,
            lineWrapping: false,
            // keyMap: {
            //     'Enter': (cm: { preventDefault: () => void; }) => {
            //         cm.preventDefault(); // Ngăn phím Enter
            //     }
            // }
        };


        watch(code, (newValue) => {
            context.emit('update:modelValue', newValue);
        });

        watch(props, (newValue) => {
            code.value = newValue.modelValue;
        });


        return { code, extensions, editorOptions };
    },
};