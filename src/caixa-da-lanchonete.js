import Cardapio from "./entities/cardapio";
import ItensSecudarios from "./entities/intens-secundarios";

class CaixaDaLanchonete {
    constructor() {
        this.cardapio = new Cardapio();
        this.itensSecudarios = new ItensSecudarios();
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        const formasDePagamentoValidas = ["debito", "credito", "dinheiro"];

        if (!formasDePagamentoValidas.includes(metodoDePagamento)) {
            return "Forma de pagamento inválida!";
        }

        if (itens.length === 0) {
            return "Não há itens no carrinho de compra!";
        }

        let total = 0;

        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo
                .split(",")
                .map((item) => item.trim());
            const cardapio = this.cardapio.getCardapio();

            if (!(codigo in cardapio)) {
                return "Item inválido!";
            }

            const item = cardapio[codigo];
            const itensSecudarios = this.itensSecudarios.getItens();

            // Verificar se o item é um item principal
            if (codigo in itensSecudarios) {
                const codigoPrincipal = itensSecudarios[codigo];
                if (
                    !itens.some((itemInfo) =>
                        itemInfo.startsWith(codigoPrincipal)
                    )
                ) {
                    return "Item extra não pode ser pedido sem o principal";
                }
            }

            if (isNaN(quantidade) || quantidade <= 0) {
                return "Quantidade inválida!";
            }

            total += item.valor * parseInt(quantidade);
        }

        if (metodoDePagamento === "dinheiro") {
            total *= 0.95; // Aplicar desconto de 5% para pagamento em dinheiro
        } else if (metodoDePagamento === "credito") {
            total *= 1.03; // Aplicar acréscimo de 3% para pagamento a crédito
        }

        // Formatar o valor com vírgula como separador decimal e depois arredondar
        total = parseFloat(total.toFixed(2));
        total = total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return `R$ ${total}`;
    }
}

export { CaixaDaLanchonete };
