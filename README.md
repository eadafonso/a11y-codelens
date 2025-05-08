# 🔍 A11y Codelens — Extensão de Acessibilidade para VSCode

**A11y Codelens** é uma extensão do VSCode que ajuda você a detectar problemas de acessibilidade em arquivos HTML e JSX diretamente durante o desenvolvimento.

---

## ✅ Funcionalidades

- Verificação de imagens sem `alt`
- Inputs com `aria-label` mas sem `id` ou `label`
- Botões sem texto acessível
- Formulários sem `aria-labelledby`
- Elementos `div` com `role="button"` sem suporte de teclado
- Tabelas sem `<caption>`, `<th>` com `scope`
- Links sem `href` válido

---

## 💡 Como usar

1. Instale a extensão localmente ou via marketplace (em breve).
2. Abra um arquivo `.html` ou `.jsx`.
3. Clique no botão `Verificar A11y` na barra de status **ou use o atalho `Cmd+Shift+A` (Mac) / `Ctrl+Shift+A` (Windows/Linux)`**.
4. Veja os avisos no editor com sugestões para correção.

---

## 🧪 Exemplo de Código para Teste

```html
<img src="foto.jpg" />
<a>Link sem href</a>
<button>
  Login<button>
    <table>
      <tr>
        <td>Dados</td>
      </tr>
    </table>
  </button>
</button>
```
