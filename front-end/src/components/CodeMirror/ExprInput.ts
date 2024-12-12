import { ref, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, completeFromList, acceptCompletion } from "@codemirror/autocomplete";
import { keymap, EditorView } from '@codemirror/view';
import completionList from './CompletionList';

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

        completionList.sort((a, b) => a.label.localeCompare(b.label));
        for (let i = 0; i < completionList.length; i++) {
            completionList[i].boost = completeFromList.length - i;
        }

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