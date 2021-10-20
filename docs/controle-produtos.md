## Do controle de produtos

O controle de produtos deve conter o seguinte fluxo:

Sua API deve salvar os carrinhos de compras criados pelos clientes que chegaram no checkout.

Ou seja

Voce deve ter um endpoint de cadastro de carrinho com os relacionamentos de carrinho para produtos.
Os carrinhos de produtos podem ser deletados, porem nao devem ser removidos da base 
de dados

Itens em carrinhos de compras nao removem unidades de estoque. Somente a efetivação da compra remove
unidades do estoque.

 Você deve disponibilizar um endpoint para o reabastecimento de estoque.
 Este endpoint deve receber a quantidade de itens que foram adquiridos para 
 repor o estoque o preço de compra da unidade no distribuidor.