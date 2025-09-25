# 🍽️ Cardápio Digital Interativo com Acessibilidade  

## 📌 Sobre o Projeto  
Este repositório contém a solução de um **cardápio digital interativo** desenvolvido para restaurantes, com foco em **acessibilidade para pessoas com deficiência visual severa e baixa visão**, mas também atendendo ao público sem deficiência visual.  

A aplicação visa tornar a experiência em restaurantes mais inclusiva, prática e eficiente, gerenciando todo o fluxo:  
- 📋 **Fila de espera**  
- 🪑 **Indicação de mesa livre**  
- 🍴 **Pedidos**  
- 💳 **Fechamento da conta e pagamento**  

Além disso, o sistema permite o **cadastro e gerenciamento de produtos, mesas e usuários**, além de indicar os **itens mais vendidos por categoria**.  

---

## ⚙️ Tecnologias Utilizadas  

- **Backend:** [Django Rest Framework](https://www.django-rest-framework.org/)  
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)  
- **Frontend:** [React](https://reactjs.org/)  
- **IA de Voz (Text-to-Speech):** [Amazon Polly](https://aws.amazon.com/polly/)  

---

## 🚀 Funcionalidades  

✅ **Acessibilidade**  
- Leitura de menus e opções via IA de voz.  
- Interfaces com foco em contraste e usabilidade para baixa visão.  

✅ **Gestão do Restaurante**  
- Cadastro de produtos: pratos, entradas, sobremesas, bebidas e drinks.  
- Cadastro de mesas do estabelecimento.  
- Cadastro de usuários do sistema (diretores, administradores, atendentes).  
- (🔄 Em definição) Cadastro de clientes.  

✅ **Atendimento Digital**  
- Fila de espera digital.  
- Indicação automática de mesa livre.  
- Realização de pedidos online.  
- Pagamento integrado.  
- Fechamento da conta pelo sistema.  

✅ **Inteligência de Negócio**  
- Relatórios de pedidos.  
- Indicação dos **itens mais vendidos por categoria**.  

---

## 📂 Estrutura do Projeto  

```
.
├── backend/            # API Django Rest Framework
│   ├── apps/           # Módulos (produtos, mesas, pedidos, usuários, etc.)
│   ├── settings/       # Configurações do Django
│   └── ...
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── pages/      # Páginas da aplicação
│   │   └── services/   # Comunicação com a API
│   └── ...
├── docs/               # Documentação
└── README.md           # Este arquivo
```

---

## 🛠️ Como Executar Localmente  

### 🔧 Pré-requisitos  
- [Python 3.11+](https://www.python.org/)  
- [Node.js 18+](https://nodejs.org/)  
- [PostgreSQL 15+](https://www.postgresql.org/)  
- [Docker](https://www.docker.com/) (opcional, recomendado)  

### ▶️ Passo a passo  

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```

2. **Configure o backend**  
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Configure o frontend**  
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Acesse em:  
   ```
   http://localhost:3000
   ```

---

## 📈 Roadmap  

- [ ] Cadastro de clientes.  
- [ ] Integração com carteiras digitais (Pix, Apple Pay, Google Pay).  
- [ ] Recomendação personalizada via **IA**.  
- [ ] Estatísticas avançadas de consumo.  

---

## 🤝 Contribuição  

Contribuições apenas dos membros do grupo 02 de Projetos 4!  
Siga os passos:   

1. Faça um fork do projeto.  
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).  
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).  
4. Faça o push para a branch (`git push origin feature/nova-feature`).  
5. Abra um Pull Request.  

---  
