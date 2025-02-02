const formatCurrency = (n) => {
  const currency = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  });
  return currency.format(n);
};

const debounceTimer = (fn, msec) => {
	let lastCall = 0;
	let lastCallTimer;

	return (...arg) => {
		const previousCall = lastCall;
		lastCall = Date.now();

		if (previousCall && ((lastCall - previousCall) <= msec)) {
			clearTimeout(lastCallTimer)
		}

		lastCallTimer = setTimeout(() => {
			fn(...arg)
		}, msec)
	}
}
{
  //навигация
  const navigationLinks = document.querySelectorAll(".navigation__link");
  const calcElems = document.querySelectorAll(".calc");

  //to display all the elemnts separately

  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", (e) => {
      e.preventDefault();
      for (let j = 0; j < calcElems.length; j++) {
        if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
          calcElems[j].classList.add("calc_active");
          navigationLinks[i].classList.add("navigation__link_active");
        } else {
          calcElems[j].classList.remove("calc_active");
          navigationLinks[j].classList.remove("navigation__link_active");
        }
      }
    });
  }
}

{
  // ausn
  const ausn = document.querySelector(".ausn");
  const formAusn = ausn.querySelector(".calc__form");
  const resultTaxTotal = ausn.querySelector(".result__tax_total");
  const calcLabelExpenses = ausn.querySelector(".calc__label_expenses");

  calcLabelExpenses.style.display = "none";

  formAusn.addEventListener("input", debounceTimer((e) => {
const income = +formAusn.income.value;

    if (formAusn.type.value === "income") {
      resultTaxTotal.textContent = formatCurrency(income * 0.08);
      formAusn.expenses.value = "";
    }
    if (formAusn.type.value === "expenses") {
			calcLabelExpenses.style.display = "";
			const expenses = +formAusn.expenses.value;
			const profit = income < expenses ? 0 : income - expenses;
      resultTaxTotal.textContent = formatCurrency(profit * 0.2);
    }
  }, 500));
}

{
  //самозанятые и ИП
  const selfEmployment = document.querySelector(".self-employment");
  const formSelfEmployment = selfEmployment.querySelector(".calc__form");
  const resultTaxSelfEmployment = selfEmployment.querySelector(".result__tax");
  const calcCompensation = selfEmployment.querySelector(
    ".calc__label_compensation"
  );
  const resultBlockCompensation = selfEmployment.querySelectorAll(
    ".result__block_compensation"
  );

  const resultTaxCompensation = selfEmployment.querySelector(
    ".result__tax_compensation"
  );
  const resultTaxRestCompensation = selfEmployment.querySelector(
    ".result__tax_rest-compensation"
  );
  const resultTaxResult = selfEmployment.querySelector(".result__tax-result");

  const checkCompensation = () => {
    const setDsplay = formSelfEmployment.addCompensation.checked ? "" : "none";
    calcCompensation.style.display = setDsplay;

    resultBlockCompensation.forEach((elem) => {
      elem.style.display = setDsplay;
    });
  };
  checkCompensation();

  formSelfEmployment.addEventListener("input", debounceTimer((e) => {
		const individual = +formSelfEmployment.individual.value;
		const entity = +formSelfEmployment.entity.value;
    const resIndividual = individual * 0.04;
    const resEntity = entity * 0.06;

    checkCompensation();

    const tax = resIndividual + resEntity;

    formSelfEmployment.compensation.value =
		+formSelfEmployment.compensation.value > 10_000
        ? 10_000
        : formSelfEmployment.compensation.value;
    const benefit = +formSelfEmployment.compensation.value;
    const resBenefit = individual * 0.01 + entity * 0.02;
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
    const finalTax = tax - (benefit - finalBenefit);

    resultTaxSelfEmployment.textContent = formatCurrency(tax);
    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
    resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
    resultTaxResult.textContent = formatCurrency(finalTax);
  }, 500));
}

{
  //ОСНО
  const osno = document.querySelector(".osno");
  const formOsno = osno.querySelector(".calc__form");

  const ndflExpenses = osno.querySelector(".result__block_ndfl-expenses");
  const ndflIncome = osno.querySelector(".result__block_ndfl-income");
  const profit = osno.querySelector(".result__block_profit");

  const resultTaxNds = osno.querySelector(".result__tax_nds");
  const resultTaxProperty = osno.querySelector(".result__tax_property");
  const resultTaxNdflExpenses = osno.querySelector(
    ".result__tax_ndfl-expenses"
  );
  const resultTaxIncome = osno.querySelector(".result__tax_income");
  const resultTaxProfit = osno.querySelector(".result__tax_profit");

  const checkFormBusiness = () => {
    if (formOsno.formBusiness.value === "ИП") {
      ndflExpenses.style.display = "";
      ndflIncome.style.display = "";
      profit.style.display = "none";
    }
    if (formOsno.formBusiness.value === "ООО") {
      ndflExpenses.style.display = "none";
      ndflIncome.style.display = "none";
      profit.style.display = "";
    }
  };
  checkFormBusiness();

  formOsno.addEventListener("input", debounceTimer((e) => {
    checkFormBusiness();

    const income = +formOsno.income.value;
    const expenses = +formOsno.expenses.value;
    const property = +formOsno.property.value;

    const nds = income * 0.2;
    const taxProperty = property * 0.02;
    const profit = income < expenses ? 0 : income - expenses;
    const ndflExpensesTotal = profit * 0.13;
    const ndflIncomTotal = (income - nds) * 0.13;
    const taxProfit = profit * 0.02;

    resultTaxNds.textContent = formatCurrency(nds);
    resultTaxProperty.textContent = formatCurrency(taxProperty);
    resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
    resultTaxIncome.textContent = formatCurrency(ndflIncomTotal);
    resultTaxProfit.textContent = formatCurrency(taxProfit);
  }, 500));
}

{
  //УСН
  const LIMIT = 300_000;
  const usn = document.querySelector(".usn");
  const formUsn = usn.querySelector(".calc__form");

  const calcLabelExpenses = usn.querySelector(".calc__label_expenses");
  const calcLabelProperty = usn.querySelector(".calc__label_property");
  const resultBlockProperty = usn.querySelector(".result__block_property");

  const resultTaxTotal = usn.querySelector(".result__tax_total");
  const resultTaxProperty = usn.querySelector(".result__tax_property");

  const checkShowProperty = (typeTax) => {
    switch (typeTax) {
      case "income": {
        calcLabelExpenses.style.display = "none";
        calcLabelProperty.style.display = "none";
        resultBlockProperty.style.display = "none";

        formUsn.expenses.value = "";
        formUsn.property.value = "";
        break;
      }
      case "ip-expenses": {
        calcLabelExpenses.style.display = "";
        calcLabelProperty.style.display = "none";
        resultBlockProperty.style.display = "none";

        formUsn.property.value = "";
        break;
      }
      case "ooo-expenses": {
        calcLabelExpenses.style.display = "";
        calcLabelProperty.style.display = "";
        resultBlockProperty.style.display = "";
        break;
      }
    }
  };

  const percent = {
    income: 0.06,
    "ip-expenses": 0.15,
    "ooo-expenses": 0.15,
  };
  checkShowProperty(formUsn.typeTax.value);

  formUsn.addEventListener("input", debounceTimer((e) => {
    checkShowProperty(formUsn.typeTax.value);

    const income = +formUsn.income.value;
    const expenses = +formUsn.expenses.value;
    const contributions =+formUsn.contributions.value;
    const property = +formUsn.property.value;

    let profit = income - contributions;

		if (formUsn.typeTax.value !== income) {
			profit -= expenses;
		}

    const taxBigIncom = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
    const summ = profit - (taxBigIncom < 0 ? 0 : taxBigIncom);
    const tax = summ * percent[formUsn.typeTax.value];
		const taxProperty = property * 0.02;

		resultTaxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
		resultTaxProperty.textContent = formatCurrency(taxProperty);
  }, 500));
}

{
	//13%
	const taxReturn = document.querySelector('.tax-return');
	const formTaxReturn = taxReturn.querySelector(".calc__form");
	
	const resultTaxTaxNdfl = taxReturn.querySelector('.result__tax_tax_ndfl');
const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

formTaxReturn.addEventListener('input', debounceTimer(() => {
	const expenses = +formTaxReturn.expenses.value;
	const income = +formTaxReturn.income.value;
	const sumExpense = +formTaxReturn.sumExpenses.value;

	const ndfl = income * 0.13;
	const possibleDeduction = expenses < sumExpense
	? expenses * 0.13 
	: sumExpense * 0.13;

	const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;
	
	resultTaxTaxNdfl.textContent = formatCurrency(ndfl);
	resultTaxPossible.textContent = formatCurrency(possibleDeduction);
	resultTaxDeduction.textContent = formatCurrency(deduction);

	
}, 500));
}
